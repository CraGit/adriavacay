/**
 * Attach MyRent calendar (or iCal fallback) to a Prismic accommodation.
 * On MyRent prices failure, still returns the accommodation with myRentId set
 * so dated search can match via POST /user/free.
 */

import {
  fetchMyRentDays,
  isDynamicServerUsage,
  isMyRentPricesError,
} from "@/lib/myrent";
import { myRentOccupiedDates } from "@/lib/myrent-utils";
import { occupiedDatesFromIcal } from "@/lib/utils";
import { cleanAccommodationPricingData } from "@/lib/validation";

/**
 * @param {object} accommodation — Prismic document
 * @param {{ pricing?: array, discounts?: array, myRentId?: string|number, icalUrl?: string }} options
 */
export async function withMyRentCalendar(accommodation, options = {}) {
  const pricing = options.pricing ?? accommodation.data?.pricing ?? [];
  const discounts = options.discounts ?? accommodation.data?.discounts ?? [];
  const rawId = options.myRentId ?? accommodation.data?.myRentID;
  const myRentId = rawId != null && rawId !== "" ? Number(rawId) : null;
  const icalUrl = options.icalUrl ?? accommodation.data?.ical ?? "";

  const base = {
    ...accommodation,
    pricing,
    discounts,
    checkoutDates: [],
  };

  if (Number.isInteger(myRentId) && myRentId > 0) {
    try {
      const myRentDays = await fetchMyRentDays(myRentId);
      return {
        ...base,
        myRentId,
        myRentDays,
        occupiedDates: myRentOccupiedDates(myRentDays),
      };
    } catch (err) {
      if (isDynamicServerUsage(err)) throw err;
      if (!isMyRentPricesError(err)) {
        console.error(`[MyRent] prices failed for property ${myRentId}:`, err);
      }
      // Keep listing the villa; dated search uses /user/free instead of myRentDays.
      return {
        ...base,
        myRentId,
        myRentDays: null,
        occupiedDates: [],
      };
    }
  }

  if (icalUrl) {
    const occupiedData = await occupiedDatesFromIcal(icalUrl);
    return cleanAccommodationPricingData({
      ...base,
      occupiedDates: occupiedData.occupiedDates,
      checkoutDates: occupiedData.checkoutDates,
    });
  }

  return cleanAccommodationPricingData({
    ...base,
    occupiedDates: [],
  });
}
