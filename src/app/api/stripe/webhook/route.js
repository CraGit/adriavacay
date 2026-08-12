import { NextResponse } from "next/server";

import { sendMail } from "@/lib/mail";
import { deleteRent, markMyRentStripePayment } from "@/lib/myrent";
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

  const villa = meta.villa_name || meta.uid || "property";
  const amountDue = meta.amount_due || "";
  const total = meta.total || "";
  const guestEmail = meta.guest_email || session.customer_email;
  const guestName = meta.guest_name || "Guest";

  const guestText = `
Dear ${guestName},

Thank you — your payment for ${villa} was received.

Stay: ${meta.from_date} – ${meta.until_date}
Guests: ${meta.guests}
Stay total: EUR ${total}
Paid now: EUR ${amountDue}
Reference: ${meta.erp_id}

We look forward to hosting you.

AdriaVacay
`.trim();

  const ownerText = `
Stripe booking paid

Villa: ${villa}
Guest: ${guestName}
Email: ${guestEmail}
Phone: ${meta.guest_phone}
Dates: ${meta.from_date} – ${meta.until_date}
Guests: ${meta.guests}
Stay total: EUR ${total}
Paid now (${meta.percent}%): EUR ${amountDue}
erp_id: ${meta.erp_id}
rent_guid: ${rentGuid}
Stripe session: ${session.id}
`.trim();

  try {
    if (guestEmail) {
      await sendMail({
        to: guestEmail,
        subject: `AdriaVacay — booking confirmed (${villa})`,
        text: guestText,
      });
    }
    if (process.env.MAIL_TO) {
      await sendMail({
        to: process.env.MAIL_TO,
        replyTo: guestEmail,
        subject: `AdriaVacay — Stripe paid ${meta.erp_id}`,
        text: ownerText,
      });
    }
  } catch (error) {
    console.error("Post-payment email failed:", error);
  }
}

async function handleCheckoutExpired(session) {
  const rentGuid = session.metadata?.rent_guid;
  if (!rentGuid) {
    console.warn("checkout.session.expired without rent_guid", session.id);
    return;
  }
  try {
    await deleteRent(rentGuid);
  } catch (error) {
    console.error("Failed to delete MyRent hold on session expire:", error);
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
