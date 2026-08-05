/**
 * Server-only booking quote helpers.
 */

import { format } from "date-fns";

import { calculateDeposit } from "@/lib/deposit";
import {
  fetchMyRentDays,
  createRent,
} from "@/lib/myrent";
import {
  myRentCalculatePrice,
  myRentCalculatePriceWithDiscount,
  myRentIsEndDateValid,
} from "@/lib/myrent-utils";
import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
} from "@/lib/utils";
import { createClient } from "@/prismicio";

/**
 * Load accommodation (locale + EN for MyRent ID / pricing fields).
 */
export async function loadAccommodationForBooking(uid, locale = "en-us") {
  const client = createClient();
  const page = await client
    .getByUID("accommodation_single", uid, { lang: locale })
    .catch(() => null);

  if (!page) {
    return null;
  }

  const uidEn =
    locale === "en-us"
      ? uid
      : page.alternate_languages?.find((lang) => lang.lang === "en-us")?.uid;

  const pageEn = uidEn
    ? await client
        .getByUID("accommodation_single", uidEn, { lang: "en-us" })
        .catch(() => page)
    : page;

  return { page, pageEn };
}

/**
 * Compute stay total and deposit. Prefers MyRent when myRentID is set.
 *
 * @returns {Promise<{
 *   villaName: string,
 *   myRentId: number|null,
 *   total: number,
 *   amountDue: number,
 *   percent: number,
 *   daysUntilCheckIn: number,
 *   nights: number,
 *   myRentDays: object|null,
 * }>}
 */
export async function computeBookingQuote({
  uid,
  locale,
  dateFrom,
  dateTo,
  guests,
}) {
  const loaded = await loadAccommodationForBooking(uid, locale);
  if (!loaded) {
    throw new Error("Property not found");
  }

  const { page, pageEn } = loaded;
  const villaName = page.data.heading || pageEn.data.heading || uid;
  const myRentIdRaw = pageEn.data.myRentID;
  const myRentId = myRentIdRaw ? Number(myRentIdRaw) : null;

  let total = 0;
  let myRentDays = null;

  if (myRentId) {
    myRentDays = await fetchMyRentDays(myRentId);
    if (!myRentIsEndDateValid(dateFrom, dateTo, myRentDays)) {
      throw new Error("Selected dates are not available");
    }
    total = myRentCalculatePriceWithDiscount(
      myRentDays,
      pageEn.data.discounts || page.data.discounts || [],
      dateFrom,
      dateTo
    );
    if (total <= 0) {
      total = myRentCalculatePrice(myRentDays, dateFrom, dateTo);
    }
  } else {
    const pricing = pageEn.data.pricing || page.data.pricing || [];
    const discounts = pageEn.data.discounts || page.data.discounts || [];
    total = calculateTotalPriceWithDiscount(
      pricing,
      discounts,
      dateFrom,
      dateTo
    );
    if (total <= 0) {
      total = calculateTotalPrice(pricing, dateFrom, dateTo);
    }
  }

  if (total <= 0) {
    throw new Error("Unable to calculate price for the selected dates");
  }

  const deposit = calculateDeposit(total, dateFrom);
  const nights = Math.max(
    0,
    Math.round((dateTo - dateFrom) / (1000 * 60 * 60 * 24))
  );

  return {
    villaName,
    myRentId: myRentId && Number.isInteger(myRentId) ? myRentId : null,
    total,
    amountDue: deposit.amountDue,
    percent: deposit.percent,
    daysUntilCheckIn: deposit.daysUntilCheckIn,
    nights,
    myRentDays,
    page,
    pageEn,
    guests: Number(guests) || 1,
    fromDateStr: format(dateFrom, "yyyy-MM-dd"),
    untilDateStr: format(dateTo, "yyyy-MM-dd"),
  };
}

/**
 * Create unpaid MyRent hold for a quote.
 */
export async function createUnpaidMyRentHold({
  quote,
  name,
  email,
  phone,
  paymentMethod,
  locale,
}) {
  if (!quote.myRentId) {
    throw new Error(
      "This property is not connected to MyRent and cannot be booked online"
    );
  }

  const note = [
    "Source: AdriaVacay website",
    `Payment method: ${paymentMethod}`,
    `Locale: ${locale}`,
    `Stay total: EUR ${quote.total}`,
    `Amount due now (${quote.percent}%): EUR ${quote.amountDue}`,
  ].join(" | ");

  return createRent({
    objectId: quote.myRentId,
    fromDate: quote.fromDateStr,
    untilDate: quote.untilDateStr,
    adults: quote.guests,
    children: 0,
    price: quote.total,
    inAdvance: quote.amountDue,
    inAdvancePaid: "N",
    paid: "N",
    contactName: name,
    contactEmail: email,
    contactTel: phone,
    note,
    languageId: locale?.startsWith("de") ? "2" : "1",
  });
}
