/**
 * MyRent channel manager — client-safe pure utility functions.
 * No API calls, no process.env access. Safe to import from client components.
 * Server-side fetching lives in @/lib/myrent.
 *
 * Day keys use toStayDateISO (UTC-noon / Zagreb-safe), never process-local format().
 */

import {
  addStayDaysISO,
  eachStayNightISO,
  stayDateToUtcNoon,
  stayNightsCount,
  toStayDateISO,
} from "./stay-dates";
import { filterValidDiscountRanges } from "./validation";

/**
 * Convert raw MyRent day array → plain object keyed by "YYYY-MM-dd".
 * Plain object (not Map) is required for Next.js server→client prop serialization.
 *
 * @param {Array} days — raw array from /user/prices/{id}
 * @returns {{ [date: string]: { price: number, checkIn: boolean, checkOut: boolean, minStay: number, available: boolean } }}
 */
export function myRentToDayRecord(days) {
  const record = {};
  for (const d of days) {
    record[d.day] = {
      price: d.price,
      checkIn: d.check_in === "Y",
      checkOut: d.check_out === "Y",
      minStay: d.min_stay,
      available: d.available === "Y",
    };
  }
  return record;
}

/**
 * Prismic discount percentage for a calendar day (first matching range wins).
 * `dayIso` is yyyy-MM-dd.
 */
function getDiscountForDateISO(dayIso, discountRanges) {
  for (const discount of discountRanges) {
    const start = discount.date_start?.slice?.(0, 10) || discount.date_start;
    const end = discount.date_end?.slice?.(0, 10) || discount.date_end;
    if (start && end && dayIso >= start && dayIso <= end) {
      return discount.percentage;
    }
  }
  return 0;
}

/**
 * Calculate total price for a stay using MyRent per-day prices.
 * Sums `price` for each night in [startDate, endDate) — checkout day is not charged.
 */
export function myRentCalculatePrice(dayRecord, startDate, endDate) {
  const nights = eachStayNightISO(startDate, endDate);
  if (nights.length <= 0) return 0;

  return nights.reduce((total, key) => {
    return total + (dayRecord[key]?.price ?? 0);
  }, 0);
}

/**
 * Apply Prismic date-range percentage discounts on top of MyRent nightly rates.
 * Same night window as myRentCalculatePrice: [startDate, endDate).
 *
 * @returns {number} Floored total after discount
 */
export function myRentCalculatePriceWithDiscount(
  dayRecord,
  discountRanges,
  startDate,
  endDate
) {
  const nights = eachStayNightISO(startDate, endDate);
  if (nights.length <= 0) return 0;

  const validDiscountRanges = filterValidDiscountRanges(discountRanges);

  let totalPrice = 0;
  let totalDiscount = 0;

  for (const key of nights) {
    const price = dayRecord[key]?.price ?? 0;
    if (price <= 0) continue;

    const percentage = getDiscountForDateISO(key, validDiscountRanges);
    totalPrice += price;
    totalDiscount += (price * percentage) / 100;
  }

  return Math.floor(totalPrice - totalDiscount);
}

/**
 * Is this date a valid check-in?
 * Requires available=Y AND check_in=Y on that day.
 */
export function myRentIsValidCheckIn(date, dayRecord) {
  const key = toStayDateISO(date);
  const d = dayRecord[key];
  return !!d && d.available && d.checkIn;
}

/**
 * Is this date a valid checkout?
 * Requires check_out=Y. Availability of the checkout day itself is irrelevant (guest is departing).
 */
export function myRentIsValidCheckOut(date, dayRecord) {
  const key = toStayDateISO(date);
  const d = dayRecord[key];
  return !!d && d.checkOut;
}

/**
 * Validate a complete stay from startDate to endDate:
 *  - startDate is a valid check-in (available=Y AND check_in=Y)
 *  - endDate has check_out=Y
 *  - Number of nights >= minStay of the check-in day
 *  - Every night in [startDate, endDate) has available=Y
 */
export function myRentIsEndDateValid(startDate, endDate, dayRecord) {
  if (!myRentIsValidCheckIn(startDate, dayRecord)) return false;
  if (!myRentIsValidCheckOut(endDate, dayRecord)) return false;

  const nights = stayNightsCount(startDate, endDate);
  if (nights <= 0) return false;

  const startKey = toStayDateISO(startDate);
  const startDayData = dayRecord[startKey];
  if (startDayData?.minStay && nights < startDayData.minStay) return false;

  for (const key of eachStayNightISO(startDate, endDate)) {
    if (!dayRecord[key]?.available) return false;
  }

  return true;
}

/**
 * Does this start date have at least one valid checkout within the next 60 days?
 */
export function myRentHasValidEndDates(startDate, dayRecord) {
  const startIso = toStayDateISO(startDate);
  if (!startIso) return false;

  for (let i = 1; i <= 60; i++) {
    const end = stayDateToUtcNoon(addStayDaysISO(startIso, i));
    if (myRentIsEndDateValid(startDate, end, dayRecord)) {
      return true;
    }
  }
  return false;
}

/**
 * Extract unavailable (occupied) dates from a MyRent day record as UTC-noon Dates.
 * Mirrors the shape of occupiedDates produced by occupiedDatesFromIcal.
 */
export function myRentOccupiedDates(dayRecord) {
  return Object.entries(dayRecord)
    .filter(([, d]) => !d.available)
    .map(([dateStr]) => stayDateToUtcNoon(dateStr));
}
