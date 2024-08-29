"use client";

import { differenceInCalendarDays } from "date-fns";

import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
  cn,
  currency,
  df,
} from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";

export default function PriceDisplay({ prices, discounts, className }) {
  const { query, updateQuery } = useSearch();

  if (query.dateRange.from === null || query.dateRange.to === null) {
    return null;
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

  console.log({ basePrice, priceWithDiscount });

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
        </ul>
      </div>
    </div>
  );
}
