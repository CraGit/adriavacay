"use client";

import { differenceInCalendarDays } from "date-fns";

import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
  cn,
  currency,
  df,
} from "@/lib/utils";
import {
  hasSufficientPricingData,
  filterValidPriceRanges,
} from "@/lib/validation";
import { useSearch } from "@/providers/search-provider";

export default function PriceDisplay({
  prices,
  discounts,
  deposit,
  className,
}) {
  const { query, updateQuery } = useSearch();

  if (query.dateRange.from === null || query.dateRange.to === null) {
    return null;
  }

  // Validate pricing data before calculations
  if (!hasSufficientPricingData(prices)) {
    return (
      <div className={cn("rounded-md bg-slate-50 shadow", className)}>
        <div className="p-6">
          <h5 className="text-2xl font-medium">Price</h5>
          <p className="text-slate-400 mt-4">
            Pricing information is currently unavailable for the selected dates.
          </p>
        </div>
      </div>
    );
  }

  const nights = differenceInCalendarDays(
    query.dateRange.to,
    query.dateRange.from
  );

  const basePrice = calculateTotalPrice(
    prices,
    query.dateRange.from,
    query.dateRange.to
  );
  const priceWithDiscount = calculateTotalPriceWithDiscount(
    prices,
    discounts,
    query.dateRange.from,
    query.dateRange.to
  );

  // If calculations still return 0 or invalid prices, show error message
  if (basePrice <= 0) {
    return (
      <div className={cn("rounded-md bg-slate-50 shadow", className)}>
        <div className="p-6">
          <h5 className="text-2xl font-medium">Price</h5>
          <p className="text-slate-400 mt-4">
            Unable to calculate price for the selected dates. Please try
            different dates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md bg-slate-50 shadow", className)}>
      <div className="p-6">
        <h5 className="text-2xl font-medium">Price</h5>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-medium">for {nights} nights</span>
          <span className="bg-green-600/10 text-green-600 text-sm px-2.5 py-0.75 rounded h-6">
            Best price Guarantee
          </span>
        </div>

        <ul className="list-none mt-4">
          <li className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Check-in - Check-out</span>
            <span className="font-medium text-sm">
              {df(query.dateRange.from, "PP")} - {df(query.dateRange.to, "PP")}
            </span>
          </li>
          {/* safety deposit moved below total per UX request */}

          {basePrice === priceWithDiscount && (
            <li className="flex justify-between items-center mt-2">
              <span className="text-slate-400 text-sm">Total</span>
              <span className="font-medium text-sm">
                {currency(priceWithDiscount)}
              </span>
            </li>
          )}

          {basePrice !== priceWithDiscount && (
            <>
              <li className="flex justify-between items-center mt-2">
                <span className="text-slate-400 text-sm">Base price</span>
                <span className="font-medium text-sm">
                  {currency(basePrice)}
                </span>
              </li>
              <li className="flex justify-between items-center mt-2">
                <span className="text-slate-400 text-sm">Discount</span>
                <span className="font-medium text-sm">
                  {currency(basePrice - priceWithDiscount)}
                </span>
              </li>
              <li className="flex justify-between items-center mt-2">
                <span className="text-slate-400 text-sm">Total</span>
                <span className="font-medium text-sm">
                  {currency(priceWithDiscount)}
                </span>
              </li>
            </>
          )}

          {/* Safety deposit shown after total with refundable label (single instance) */}
          <li className="flex justify-between items-center mt-2">
            <span className="text-slate-400 text-sm">Safety deposit (refundable)</span>
            <span className="font-medium text-sm">{`+${currency(deposit)}`}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
