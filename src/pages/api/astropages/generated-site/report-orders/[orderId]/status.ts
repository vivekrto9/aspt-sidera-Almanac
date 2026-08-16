import type { APIRoute } from "astro";
import { getCommerceOrder } from "../../../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerSession } from "../../../../../../server/aggregator/customer-auth.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import { getRuntimeEnv } from "../../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.report-order-status";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  const order = await getCommerceOrder(
    env,
    safeString(context.params.orderId),
    auth.session.account.id,
  );
  if (!order || order.orderType !== "report")
    return errorResponse(feature, "Report order was not found.", 404);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "checkout-and-payments",
    message: "Report order status loaded.",
    data: { order },
  });
};
