import { createElement } from "react";

import {
  StripeAgencyNotificationEmail,
  StripeGuestConfirmationEmail,
} from "@/emails/stripe-confirmation";
import { sendMail } from "@/lib/mail";
import { getStripe } from "@/lib/stripe";

const EMAIL_SENT_KEY = "confirmation_email_sent";

/**
 * Send guest + agency confirmation emails after a paid Stripe Checkout session.
 * Idempotent via Checkout Session metadata so webhook + success page can both call it.
 */
export async function sendStripeBookingConfirmationEmails(session) {
  if (!session || session.payment_status !== "paid") {
    return { sent: false, reason: "not_paid" };
  }

  const meta = session.metadata || {};
  if (meta[EMAIL_SENT_KEY] === "true") {
    return { sent: false, reason: "already_sent" };
  }

  const villa = meta.villa_name || meta.uid || "property";
  const amountDue = meta.amount_due || "";
  const total = meta.total || "";
  const guestEmail = meta.guest_email || session.customer_email;
  const guestName = meta.guest_name || "Guest";
  const rentGuid = meta.rent_guid;

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
Payment method: Card (Stripe)
Stay total: EUR ${total}
Paid now (${meta.percent}%): EUR ${amountDue}
erp_id: ${meta.erp_id}
rent_guid: ${rentGuid}
Stripe session: ${session.id}
`.trim();

  // Claim before sending so a concurrent caller skips (webhook used to also
  // send and raced the success page → duplicate guest/agency mail).
  try {
    const stripe = getStripe();
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...meta,
        [EMAIL_SENT_KEY]: "true",
      },
    });
  } catch (error) {
    console.error(
      "[stripe-confirmation] Failed to claim confirmation_email_sent:",
      error
    );
  }

  if (!guestEmail) {
    console.error(
      "[stripe-confirmation] Missing guest email for session",
      session.id
    );
  }
  if (!process.env.MAIL_TO) {
    console.error("[stripe-confirmation] MAIL_TO is not configured");
  }

  if (guestEmail) {
    await sendMail({
      to: guestEmail,
      subject: `AdriaVacay — booking confirmed (${villa})`,
      text: guestText,
      react: createElement(StripeGuestConfirmationEmail, {
        guestName,
        villa,
        fromDate: meta.from_date,
        untilDate: meta.until_date,
        guests: meta.guests,
        total,
        amountDue,
        reference: meta.erp_id,
      }),
    });
  }

  if (process.env.MAIL_TO) {
    await sendMail({
      to: process.env.MAIL_TO,
      replyTo: guestEmail || undefined,
      subject: `AdriaVacay — Stripe paid ${meta.erp_id || session.id}`,
      text: ownerText,
      react: createElement(StripeAgencyNotificationEmail, {
        villa,
        guestName,
        guestEmail,
        guestPhone: meta.guest_phone,
        fromDate: meta.from_date,
        untilDate: meta.until_date,
        guests: meta.guests,
        total,
        amountDue,
        percent: meta.percent,
        erpId: meta.erp_id,
        rentGuid,
        sessionId: session.id,
      }),
    });
  }

  if (!guestEmail && !process.env.MAIL_TO) {
    return { sent: false, reason: "no_recipients" };
  }

  return { sent: true };
}
