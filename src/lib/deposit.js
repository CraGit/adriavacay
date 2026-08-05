/**
 * Deposit rules for website bookings (client-safe).
 * 30% if check-in is 31+ calendar days from today; otherwise 100%.
 */

import { differenceInCalendarDays, startOfDay } from "date-fns";

/** Extra % off stay total when guest pays by bank transfer (after Prismic discounts). */
export const BANK_TRANSFER_DISCOUNT_PERCENT = 2;

/**
 * Apply bank-transfer discount to stay total (excludes security deposit).
 * @param {number} totalStayPrice
 * @returns {number}
 */
export function applyBankTransferDiscount(totalStayPrice) {
  const total = Math.max(0, Math.floor(Number(totalStayPrice) || 0));
  return Math.floor(
    (total * (100 - BANK_TRANSFER_DISCOUNT_PERCENT)) / 100
  );
}

/**
 * @param {number} totalStayPrice - Full stay total (after discounts)
 * @param {Date} checkInDate
 * @param {Date} [today=new Date()]
 * @returns {{ amountDue: number, percent: 30 | 100, daysUntilCheckIn: number }}
 */
export function calculateDeposit(totalStayPrice, checkInDate, today = new Date()) {
  const total = Math.max(0, Math.floor(Number(totalStayPrice) || 0));
  const daysUntilCheckIn = differenceInCalendarDays(
    startOfDay(checkInDate),
    startOfDay(today)
  );
  const percent = daysUntilCheckIn >= 31 ? 30 : 100;
  const amountDue =
    percent === 100 ? total : Math.max(1, Math.round((total * percent) / 100));

  return { amountDue, percent, daysUntilCheckIn };
}

/** Convert EUR amount to Stripe cents */
export function toStripeCents(eurAmount) {
  return Math.round(Number(eurAmount) * 100);
}
