import { NextResponse } from "next/server";

import { deleteRent, markMyRentStripePayment } from "@/lib/myrent";
import { sendStripeAbandonedPaymentEmail } from "@/lib/stripe-confirmation";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session) {
  if (session.payment_status !== "paid") {
    console.warn(
      "checkout.session.completed ignored — payment_status is not paid:",
      session.id,
      session.payment_status
    );
    return;
  }

  const meta = session.metadata || {};
  const rentGuid = meta.rent_guid;
  const objectId = meta.object_id;

  // Confirmation emails are sent from /booking/success (not here) to avoid
  // duplicate guest/agency mail when webhook and success page both run.
  if (rentGuid && objectId) {
    try {
      await markMyRentStripePayment({
        rentGuid,
        objectId,
        percent: meta.percent,
        amountDue: meta.amount_due,
        total: meta.total,
        sessionId: session.id,
        erpId: meta.erp_id,
      });
    } catch (error) {
      console.error("MyRent mark-paid failed:", error);
      throw error;
    }
  } else {
    console.error(
      "checkout.session.completed missing rent_guid/object_id",
      meta
    );
  }
}

async function handleCheckoutExpired(session) {
  const rentGuid = session.metadata?.rent_guid;
  if (!rentGuid) {
    console.warn("checkout.session.expired without rent_guid", session.id);
  } else {
    try {
      await deleteRent(rentGuid);
    } catch (error) {
      console.error("Failed to delete MyRent hold on session expire:", error);
    }
  }

  try {
    await sendStripeAbandonedPaymentEmail(
      session,
      "Session expired without payment"
    );
  } catch (error) {
    console.error("Abandoned-payment email on session expire failed:", error);
  }
}

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
