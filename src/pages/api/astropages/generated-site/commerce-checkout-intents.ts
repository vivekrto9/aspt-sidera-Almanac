import type { APIRoute } from "astro";
import {
  getCommerceOrder,
  getCommercePaymentAttempt,
  recordCommerceCheckout,
} from "../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerCsrf } from "../../../../server/aggregator/customer-auth.ts";
import { createStripeCommerceCheckout } from "../../../../server/aggregator/payments/stripe.ts";
import { createRazorpayCheckout } from "../../../../server/aggregator/payments/razorpay.ts";
import { resolveSecretBinding } from "../../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../server/generated-site/request.ts";
import {
  blockedProviderResponse,
  errorResponse,
  jsonResponse,
} from "../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.commerce-checkout";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const orderId = safeString(parsed.body.orderId);
  const attemptId = safeString(parsed.body.attemptId);
  const [order, attempt] = await Promise.all([
    getCommerceOrder(env, orderId, auth.session.account.id),
    getCommercePaymentAttempt(env, attemptId),
  ]);
  if (
    !order ||
    !attempt ||
    attempt.payableId !== order.id ||
    attempt.accountId !== auth.session.account.id
  )
    return errorResponse(feature, "Order checkout was not found.", 404);
  if (order.status !== "pending_payment")
    return errorResponse(
      feature,
      "This order is no longer awaiting payment.",
      409,
    );
  const provider = attempt.provider === "razorpay" ? "razorpay" : "stripe";
  const required = provider === "razorpay" ? ["RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET","RAZORPAY_WEBHOOK_SECRET"] : ["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET"];
  const missingSecretNames = (await Promise.all(required.map(async (name)=>[name,await resolveSecretBinding(env,name)] as const))).filter(([,value])=>!value).map(([name])=>name);
  if(missingSecretNames.length) return blockedProviderResponse({feature,capabilityKey:"checkout-and-payments",missingSecretNames,message:`${provider} checkout and its signed webhook are not configured.`});
  if (attempt.status === "requires_action" && attempt.checkoutUrl) {
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: `Existing ${provider} checkout restored.`,
      data: {
        provider,
        orderId,
        attemptId,
        checkoutUrl: attempt.checkoutUrl,
      },
    });
  }
  if (attempt.status !== "created")
    return errorResponse(feature, "Start a new order checkout.", 409);
  try {
    const checkout = provider === "stripe" ? await createStripeCommerceCheckout({
      env,
      payable: order,
      attemptId,
      origin: new URL(context.request.url).origin,
      locale: safeString(parsed.body.locale) || "en",
    }) : await createRazorpayCheckout({env,payable:order,attemptId,origin:new URL(context.request.url).origin,payableType:"commerce_order"});
    await recordCommerceCheckout({
      env,
      orderId,
      attemptId,
      sessionId: "sessionId" in checkout ? checkout.sessionId : checkout.orderId,
      checkoutUrl: checkout.checkoutUrl,
    });
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: `${provider} checkout is ready.`,
      data: {
        provider,
        orderId,
        attemptId,
        checkoutUrl: checkout.checkoutUrl,
      },
    });
  } catch (error) {
    return errorResponse(
      feature,
      error instanceof Error
        ? error.message
        : "Checkout provider request failed.",
      502,
    );
  }
};
