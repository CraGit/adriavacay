/**
 * MyRent channel manager — client-safe pure utility functions.
 * No API calls, no process.env access. Safe to import from client components.
 * Server-side fetching lives in @/lib/myrent.
 */

import { addDays, differenceInCalendarDays, eachDayOfInterval, format, isAfter, isBefore, parse, parseISO } from "date-fns";

import { filterValidDiscountRanges } from "./validation";

/**
 * Convert raw MyRent day array → plain object keyed by "YYYY-MM-DD".
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
 * Mirrors the private helper used by calculateTotalPriceWithDiscount in utils.js.
 */
function getDiscountForDate(date, discountRanges) {
  for (const discount of discountRanges) {
    if (
      !isBefore(date, parse(discount.date_start, "yyyy-MM-dd", new Date())) &&
      !isAfter(date, parse(discount.date_end, "yyyy-MM-dd", new Date()))
    ) {
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
  const nights = differenceInCalendarDays(endDate, startDate);
  if (nights <= 0) return 0;

  const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });
  return days.reduce((total, day) => {
    const key = format(day, "yyyy-MM-dd");
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
  const nights = differenceInCalendarDays(endDate, startDate);
  if (nights <= 0) return 0;

  const validDiscountRanges = filterValidDiscountRanges(discountRanges);
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(endDate, -1),
  });

  let totalPrice = 0;
  let totalDiscount = 0;

  for (const day of days) {
    const key = format(day, "yyyy-MM-dd");
    const price = dayRecord[key]?.price ?? 0;
    if (price <= 0) continue;

    const percentage = getDiscountForDate(day, validDiscountRanges);
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
  const key = format(date, "yyyy-MM-dd");
  const d = dayRecord[key];
  return !!d && d.available && d.checkIn;
}

/**
 * Is this date a valid checkout?
 * Requires check_out=Y. Availability of the checkout day itself is irrelevant (guest is departing).
 */
export function myRentIsValidCheckOut(date, dayRecord) {
  const key = format(date, "yyyy-MM-dd");
  const d = dayRecord[key];
  return !!d && d.checkOut;
}

/**
 * Validate a complete stay from startDate to endDate:
 *  - endDate has check_out=Y
 *  - Number of nights >= minStay of the check-in day
 *  - Every night in [startDate, endDate) has available=Y
 */
export function myRentIsEndDateValid(startDate, endDate, dayRecord) {
  if (!myRentIsValidCheckOut(endDate, dayRecord)) return false;

  const nights = differenceInCalendarDays(endDate, startDate);
  if (nights <= 0) return false;

  const startKey = format(startDate, "yyyy-MM-dd");
  const startDayData = dayRecord[startKey];
  if (startDayData?.minStay && nights < startDayData.minStay) return false;

  const stayDays = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });
  for (const day of stayDays) {
    const key = format(day, "yyyy-MM-dd");
    if (!dayRecord[key]?.available) return false;
  }

  return true;
}

/**
 * Does this start date have at least one valid checkout within the next 60 days?
 */
export function myRentHasValidEndDates(startDate, dayRecord) {
  for (let i = 1; i <= 60; i++) {
    if (myRentIsEndDateValid(startDate, addDays(startDate, i), dayRecord)) {
      return true;
    }
  }
  return false;
}

/**
 * Extract unavailable (occupied) dates from a MyRent day record as Date objects.
 * Mirrors the shape of occupiedDates produced by occupiedDatesFromIcal.
 */
export function myRentOccupiedDates(dayRecord) {
  return Object.entries(dayRecord)
    .filter(([, d]) => !d.available)
    .map(([dateStr]) => parseISO(dateStr));
}
