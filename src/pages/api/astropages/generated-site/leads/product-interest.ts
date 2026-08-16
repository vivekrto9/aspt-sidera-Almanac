import type { APIRoute } from "astro";
import { createLead } from "../../../../../server/aggregator/lead-records.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.leads.product-interest";
const maxBodyBytes = 16_384;

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;

  const contentLength = Number(context.request.headers.get("content-length") ?? 0);
  if (contentLength > maxBodyBytes) {
    return errorResponse(feature, "Request is too large.", 413);
  }

  const parsedBody = await readJsonBody(context.request);
  if (!parsedBody.ok) return parsedBody.response;
  const input = parsedBody.body;

  // Honeypot fields are intentionally answered without creating a record.
  if (typeof input.company === "string" && input.company.trim()) {
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "leads",
      message: "Product enquiry received.",
      data: { leadId: "accepted" },
    });
  }

  const env = await getRuntimeEnv(context);
  try {
    const result = await createLead({
      env,
      submission: {
        kind: "contact",
        source: "support",
        formKey: "sidera-chart-guidance",
        pagePath: "/lead-generation-demo",
        locale: input.locale,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        consentContact: input.consentContact,
        idempotencyKey: input.idempotencyKey,
        attribution: input.attribution,
        details: {
          topic: "product-interest",
          subject: "Personal Birth Chart",
          message: input.message,
        },
      },
    });

    if (!result.ok) {
      const status = result.message.includes("temporarily unavailable") ? 503 : 400;
      return errorResponse(feature, result.message, status);
    }

    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "leads",
      message: result.alreadyExists ? "Product enquiry already received." : "Product enquiry received.",
      data: {
        leadId: result.leadId,
        alreadyExists: result.alreadyExists,
      },
    });
  } catch {
    return errorResponse(feature, "Lead capture is temporarily unavailable.", 503);
  }
};
