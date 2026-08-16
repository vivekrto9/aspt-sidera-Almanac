import handler from "@astrojs/cloudflare/entrypoints/server";
import { maybeHandleAnalyticsMcpToolCall } from "./server/aggregator/analytics-mcp.ts";
import { maybeHandleProjectAssetRequest } from "./server/generated-site/project-assets.ts";
import { maybeHandleProjectAssetsMcp } from "./server/generated-site/project-assets-mcp.ts";
import { maybeHandleEmailTemplatesMcp } from "./server/generated-site/email-templates-mcp.ts";

export { PluginBridge } from "@emdash-cms/cloudflare/sandbox";

const fetchWithAstroPagesExtensions: typeof handler.fetch = async (request, env, context) => {
  const projectAssetResponse = await maybeHandleProjectAssetRequest(request, env);
  if (projectAssetResponse) return projectAssetResponse;
  const projectAssetMcpResponse = await maybeHandleProjectAssetsMcp(
    request,
    env,
    async () =>
      await maybeHandleEmailTemplatesMcp(
        request,
        env,
        () => handler.fetch(request, env, context),
      ) ?? handler.fetch(request, env, context),
  );
  if (projectAssetMcpResponse) return projectAssetMcpResponse;
  const emailTemplateMcpResponse = await maybeHandleEmailTemplatesMcp(
    request,
    env,
    () => handler.fetch(request, env, context),
  );
  if (emailTemplateMcpResponse) return emailTemplateMcpResponse;
  const analyticsMcpResponse = await maybeHandleAnalyticsMcpToolCall(request, env);
  if (analyticsMcpResponse) {
    return analyticsMcpResponse;
  }

  return handler.fetch(request, env, context);
};

export default {
  fetch: fetchWithAstroPagesExtensions,
};
