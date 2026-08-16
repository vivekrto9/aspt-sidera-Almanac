import emdashMiddleware from "emdash/middleware";
import { defineMiddleware, sequence } from "astro:middleware";

import {
  buildPublicRobotsTxt,
  buildPublicSitemapXml,
} from "./server/generated-site/public-seo-routes.ts";
import { astropagesContentReleaseMiddleware } from "./server/generated-site/content-release-middleware.ts";
import {
  getAccountLoginRedirect,
  isProtectedAccountPath,
} from "./server/aggregator/account-access.ts";
import { getCustomerSession } from "./server/aggregator/customer-auth.ts";
import type { RuntimeEnv } from "./server/aggregator/runtime.ts";
import { getRuntimeEnv } from "./server/generated-site/request.ts";
import { isBuilderPreviewRequest } from "./builder/builder.ts";
import { requireBuilderAccess } from "./builder/auth.ts";

const accountAuthMiddleware = defineMiddleware(async (context, next) => {
  if (!isProtectedAccountPath(context.url.pathname)) {
    return next();
  }

  const runtimeEnv = (await getRuntimeEnv(context)) as RuntimeEnv;
  const customerSession = await getCustomerSession(
    runtimeEnv,
    context.request,
  ).catch(() => null);
  if (customerSession) {
    return next();
  }

  if (isBuilderPreviewRequest(context)) {
    const builderAccess = await requireBuilderAccess(
      runtimeEnv,
      context.request,
    );
    if (builderAccess.ok) {
      return next();
    }
  }

  return context.redirect(getAccountLoginRedirect(context.url), 302);
});

const publicSeoMiddleware = defineMiddleware(async (context, next) => {
  if (context.url.pathname === "/sitemap.xml") {
    return new Response(buildPublicSitemapXml(context.url.origin), {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }

  if (context.url.pathname === "/robots.txt") {
    return new Response(buildPublicRobotsTxt(context.url.origin), {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return next();
});

export const onRequest = sequence(
  accountAuthMiddleware,
  emdashMiddleware,
  astropagesContentReleaseMiddleware,
  publicSeoMiddleware,
);
