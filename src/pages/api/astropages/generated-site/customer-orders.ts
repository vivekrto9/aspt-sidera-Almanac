import type { APIRoute } from "astro";
import { listCommerceOrders } from "../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerSession } from "../../../../server/aggregator/customer-auth.ts";
import { getRuntimeEnv } from "../../../../server/generated-site/request.ts";
import { jsonResponse } from "../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.customer-orders";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  const page = Number(context.url.searchParams.get("page") || 1);
  const pageSize = Number(context.url.searchParams.get("pageSize") || 10);
  const result = await listCommerceOrders({
    env,
    accountId: auth.session.account.id,
    page,
    pageSize,
  });
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "checkout-and-payments",
    message: "Customer orders loaded.",
    data: result,
  });
};
