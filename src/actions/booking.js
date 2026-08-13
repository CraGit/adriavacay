"use server";

import { headers } from "next/headers";
import { redirect as nextRedirect } from "next/navigation";

import { bookingSchema, bookStaySchema } from "@/data/schemas";
import { redirect, routing } from "@/i18n/routing";
import {
  computeBookingQuote,
  createUnpaidMyRentHold,
} from "@/lib/booking-quote";
import { toStripeCents } from "@/lib/deposit";
import { sendMail } from "@/lib/mail";
import { deleteRent } from "@/lib/myrent";
import { getStripe } from "@/lib/stripe";

function parseDateRange(dateRange) {
  return {
    dateFrom: dateRange?.from ? new Date(dateRange.from) : null,
    dateTo: dateRange?.to ? new Date(dateRange.to) : null,
  };
}

/** Prefer the request host so local/preview Stripe redirects stay on the current site. */
async function siteBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ||
      (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/** Path with correct locale prefix (`as-needed`: no /en-us for default). */
function localizedPath(locale, pathname) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!locale || locale === routing.defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

function bankDetailsBlock() {
  const iban = process.env.BANK_IBAN || "";
  const beneficiary = process.env.BANK_BENEFICIARY || "";
  const bankName = process.env.BANK_NAME || "";
  const prefix = process.env.BANK_REFERENCE_PREFIX || "";
  return { iban, beneficiary, bankName, prefix };
}

/**
 * Inquiry only — email owner, no MyRent write.
 */
export async function submitInquiry(uid, dateRange, guests, locale, formData) {
  const { dateFrom, dateTo } = parseDateRange(dateRange);

  const validatedFields = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message") || "",
    dateFrom,
    dateTo,
    guests,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;
  let villaName = uid;
  try {
    const quote = await computeBookingQuote({
      uid,
      locale,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      guests: data.guests,
    });
    villaName = quote.villaName;
  } catch {
    // Still send inquiry even if price/availability lookup fails
  }

  const message = `
Name: ${data.name}
Email: ${data.email}
Guests: ${data.guests}
Date from: ${data.dateFrom.toISOString().slice(0, 10)}
Date to: ${data.dateTo.toISOString().slice(0, 10)}
Villa: ${villaName}
Message: ${data.message || "(none)"}
`.trim();

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      replyTo: data.email,
      subject: "AdriaVacay - inquiry / upit za rezervaciju",
      text: message,
    });
  } catch (error) {
    console.error(error);
    return { errors: { _form: ["Failed to send inquiry email"] } };
  }

  redirect({ href: "/message-sent", locale });
}

/** @deprecated Use submitInquiry */
export async function submitBooking(uid, dateRange, guests, formData) {
  return submitInquiry(uid, dateRange, guests, "en-us", formData);
}

/**
 * Book with bank transfer: unpaid MyRent hold + emails.
 */
export async function createBankTransferBooking(
  uid,
  dateRange,
  guests,
  locale,
  formData
) {
  const { dateFrom, dateTo } = parseDateRange(dateRange);

  const validatedFields = bookStaySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateFrom,
    dateTo,
    guests,
    paymentMethod: "bank",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  let quote;
  let hold;
  try {
    quote = await computeBookingQuote({
      uid,
      locale,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      guests: data.guests,
      paymentMethod: "bank",
    });
    hold = await createUnpaidMyRentHold({
      quote,
      name: data.name,
      email: data.email,
      phone: data.phone,
      paymentMethod: "bank_transfer",
      locale,
    });
  } catch (error) {
    console.error(error);
    return {
      errors: {
        _form: [error.message || "Failed to create reservation"],
      },
    };
  }

  const bank = bankDetailsBlock();
  const paymentRef = bank.prefix
    ? `${bank.prefix}${hold.erpId}`
    : hold.erpId;

  const pricingLines =
    quote.bankDiscountPercent > 0
      ? `Stay subtotal: EUR ${quote.subtotal}
Bank transfer discount (${quote.bankDiscountPercent}%): included
Stay total after discount: EUR ${quote.total}
Amount due now (${quote.percent}%): EUR ${quote.amountDue}`
      : `Stay total: EUR ${quote.total}
Amount due now (${quote.percent}%): EUR ${quote.amountDue}`;

  const guestText = `
Dear ${data.name},

Thank you for booking ${quote.villaName}.

Stay: ${quote.fromDateStr} – ${quote.untilDateStr}
Guests: ${data.guests}
${pricingLines}

Please transfer the amount due using these bank details:

Beneficiary: ${bank.beneficiary}
Bank: ${bank.bankName}
IBAN: ${bank.iban}
Payment reference (important): ${paymentRef}

Your reservation is held unpaid until we receive the transfer. If you have questions, reply to this email.

AdriaVacay
`.trim();

  const ownerText = `
New bank-transfer booking (UNPAID hold in MyRent)

Villa: ${quote.villaName}
Guest: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Dates: ${quote.fromDateStr} – ${quote.untilDateStr}
Guests: ${data.guests}
${pricingLines}
Payment reference / erp_id: ${paymentRef}
MyRent rent_guid: ${hold.rentGuid}

Mark this booking as paid (or partially paid) manually in MyRent after the wire transfer arrives.
Cancel unpaid holds in MyRent if payment does not arrive.
`.trim();

  try {
    await sendMail({
      to: data.email,
      subject: `AdriaVacay — bank transfer instructions (${quote.villaName})`,
      text: guestText,
    });
    await sendMail({
      to: process.env.MAIL_TO,
      replyTo: data.email,
      subject: `AdriaVacay — unpaid bank booking ${paymentRef}`,
      text: ownerText,
    });
  } catch (error) {
    console.error(error);
    // Hold already created — still redirect guest; owner can follow up
  }

  redirect({
    href: `/booking/success?method=bank&ref=${encodeURIComponent(paymentRef)}`,
    locale,
  });
}

/**
 * Book with Stripe Checkout: unpaid MyRent hold, then redirect to Checkout.
 */
export async function createStripeCheckoutBooking(
  uid,
  dateRange,
  guests,
  locale,
  formData
) {
  const { dateFrom, dateTo } = parseDateRange(dateRange);

  const validatedFields = bookStaySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateFrom,
    dateTo,
    guests,
    paymentMethod: "stripe",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  let quote;
  let hold;
  try {
    quote = await computeBookingQuote({
      uid,
      locale,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      guests: data.guests,
    });
    hold = await createUnpaidMyRentHold({
      quote,
      name: data.name,
      email: data.email,
      phone: data.phone,
      paymentMethod: "stripe",
      locale,
    });
  } catch (error) {
    console.error(error);
    return {
      errors: {
        _form: [error.message || "Failed to create reservation"],
      },
    };
  }

  const base = await siteBaseUrl();
  const productName = `${quote.villaName}: ${quote.fromDateStr} – ${quote.untilDateStr}`;
  const unitAmount = toStripeCents(quote.amountDue);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      client_reference_id: hold.erpId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              metadata: {
                uid,
                myRentId: String(quote.myRentId),
                erp_id: hold.erpId,
              },
            },
          },
        },
      ],
      metadata: {
        erp_id: hold.erpId,
        rent_guid: hold.rentGuid,
        object_id: String(quote.myRentId),
        uid,
        locale,
        from_date: quote.fromDateStr,
        until_date: quote.untilDateStr,
        total: String(quote.total),
        amount_due: String(quote.amountDue),
        percent: String(quote.percent),
        guest_name: data.name,
        guest_email: data.email,
        guest_phone: data.phone,
        guests: String(data.guests),
        villa_name: quote.villaName,
      },
      success_url: `${base}${localizedPath(locale, "/booking/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${localizedPath(locale, "/booking/cancel")}?erp=${encodeURIComponent(hold.erpId)}&rent_guid=${encodeURIComponent(hold.rentGuid)}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    if (!session.url) {
      throw new Error("Failed to start Stripe Checkout");
    }

    nextRedirect(session.url);
  } catch (error) {
    if (
      typeof error?.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error(error);
    try {
      await deleteRent(hold.rentGuid);
    } catch (cleanupError) {
      console.error("Failed to clean up MyRent hold after Stripe error:", cleanupError);
    }
    return {
      errors: {
        _form: [error.message || "Failed to create Stripe Checkout"],
      },
    };
  }
}
