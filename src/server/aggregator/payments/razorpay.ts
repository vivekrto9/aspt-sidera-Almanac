import { resolveSecretBinding } from "../runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "../runtime.ts";

const basic = (value: string) => btoa(value);
const hmac = async (secret: string, value: string) => {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)))].map((b)=>b.toString(16).padStart(2,"0")).join("");
};
const equal = (a:string,b:string) => { let d=a.length^b.length; for(let i=0;i<Math.max(a.length,b.length);i++) d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0); return d===0; };
export const verifyRazorpayWebhookSignature = async ({secret,rawBody,signature}:{secret:string;rawBody:string;signature:string}) => Boolean(secret&&rawBody&&signature) && equal(await hmac(secret,rawBody),signature);

export type RazorpayPayable = {
  id:string; accountId:string; currency:string; amountCents?:number; totalCents?:number;
  customerEmail?:string; customerName?:string; orderNumber?:string; orderType?:string; reportSlug?: string; astrologerSlug?: string;
};
export const verifyRazorpayPayment = ({ payable, attemptId, payableType, entity }: { payable: RazorpayPayable; attemptId: string; payableType: string; entity: Record<string, unknown> }) => {
  const notes = entity.notes && typeof entity.notes === "object" && !Array.isArray(entity.notes) ? entity.notes as Record<string, unknown> : {};
  const amount = Number(payable.totalCents ?? payable.amountCents);
  if (safeString(notes.payableType) !== payableType || safeString(notes.payableId) !== payable.id || safeString(notes.attemptId) !== attemptId || safeString(notes.accountId) !== payable.accountId)
    return { ok: false as const, message: "Razorpay payment target does not match." };
  if (Number(entity.amount_paid ?? entity.amount) !== amount || safeString(entity.currency).toUpperCase() !== payable.currency.toUpperCase())
    return { ok: false as const, message: "Razorpay payment amount does not match." };
  if (!["paid", "captured"].includes(safeString(entity.status)))
    return { ok: false as const, message: "Razorpay payment is not paid." };
  return { ok: true as const };
};
export const createRazorpayCheckout = async ({env,payable,attemptId,origin,payableType,fetcher=fetch}:{env:RuntimeEnv;payable:RazorpayPayable;attemptId:string;origin:string;payableType:string;fetcher?:typeof fetch}) => {
  const keyId = await resolveSecretBinding(env,"RAZORPAY_KEY_ID");
  const secret = await resolveSecretBinding(env,"RAZORPAY_KEY_SECRET");
  if(!keyId||!secret) throw new Error("Razorpay credentials are not configured.");
  const amount = Number(payable.totalCents ?? payable.amountCents);
  const callbackPath = payableType === "wallet_recharge"
    ? `/wallet?payment=success&provider=razorpay&rechargeId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}`
    : payableType === "session_entitlement"
      ? `/astrologers/${encodeURIComponent(payable.astrologerSlug || "")}?payment=success&provider=razorpay&entitlementId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}`
      : payable.orderType === "shop"
        ? `/shop?view=confirmed&provider=razorpay&orderId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}`
        : `/reports/${encodeURIComponent(payable.reportSlug || "")}?payment=success&provider=razorpay&orderId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}`;
  const response = await fetcher("https://api.razorpay.com/v1/payment_links",{method:"POST",headers:{authorization:`Basic ${basic(`${keyId}:${secret}`)}`,"content-type":"application/json"},body:JSON.stringify({amount,currency:payable.currency,reference_id:attemptId,description:`Sidera ${payableType.replaceAll("_"," ")}`,customer:{name:payable.customerName||"Sidera customer",email:payable.customerEmail||undefined},notify:{sms:false,email:false},callback_url:`${origin}${callbackPath}`,callback_method:"get",notes:{platform:"astropages",template:"sidera-almanac",payableType,payableId:payable.id,attemptId,accountId:payable.accountId}})});
  const body=await response.json().catch(()=>({})) as Record<string,unknown>;
  const orderId=safeString(body.id), checkoutUrl=safeString(body.short_url);
  if(!response.ok||!orderId||!checkoutUrl) throw new Error("Razorpay checkout creation failed.");
  return {orderId,checkoutUrl};
};
