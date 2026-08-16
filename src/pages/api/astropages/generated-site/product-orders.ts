import type { APIRoute } from "astro";
import { createShopOrder } from "../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerCsrf } from "../../../../server/aggregator/customer-auth.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.product-orders";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await createShopOrder({
    env,
    accountId: auth.session.account.id,
    accountEmail: auth.session.account.email,
    requestKey: context.request.headers.get("x-idempotency-key"),
    items: parsed.body.items,
    contact: parsed.body.contact,
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse(
    {
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: result.replay
        ? "Existing product order restored."
        : "Product order created.",
      data: { order: result.order, attempt: result.attempt },
    },
    { status: result.replay ? 200 : 201 },
  );
};
