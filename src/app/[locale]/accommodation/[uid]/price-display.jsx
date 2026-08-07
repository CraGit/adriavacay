"use client";

import { useMemo } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useTranslations } from "next-intl";

import { calculateDeposit } from "@/lib/deposit";
import {
  myRentCalculatePrice,
  myRentCalculatePriceWithDiscount,
} from "@/lib/myrent-utils";
import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
  cn,
  currency,
} from "@/lib/utils";
import { hasSufficientPricingData } from "@/lib/validation";
import { useSearch } from "@/providers/search-provider";
import CustomDayPicker from "./custom-day-picker";

function computeStayTotals({
  myRentDays,
  prices,
  discounts,
  from,
  to,
}) {
  if (!from || !to) return null;

  let basePrice = 0;
  let priceWithDiscount = 0;

  if (myRentDays !== undefined) {
    if (!myRentDays) return { unavailable: true };
    basePrice = myRentCalculatePrice(myRentDays, from, to);
    priceWithDiscount = myRentCalculatePriceWithDiscount(
      myRentDays,
      discounts,
      from,
      to
    );
  } else {
    if (!hasSufficientPricingData(prices)) return { unavailable: true };
    basePrice = calculateTotalPrice(prices, from, to);
    priceWithDiscount = calculateTotalPriceWithDiscount(
      prices,
      discounts,
      from,
      to
    );
  }

  if (priceWithDiscount <= 0) priceWithDiscount = basePrice;
  if (basePrice <= 0) return { invalid: true };

  const nights = differenceInCalendarDays(to, from);
  const depositInfo = calculateDeposit(priceWithDiscount, from);

  return {
    nights,
    basePrice,
    priceWithDiscount,
    hasDiscount: basePrice !== priceWithDiscount,
    ...depositInfo,
  };
}

export default function PriceDisplay({
  prices,
  discounts,
  deposit,
  myRentDays,
  occupiedRanges,
  canBookOnline,
  pending,
  errors = {},
  onBookNow,
  onInquiry,
  className,
}) {
  const t = useTranslations("booking");
  const { query, updateQuery } = useSearch();
  const from = query.dateRange?.from ?? null;
  const to = query.dateRange?.to ?? null;
  const hasDates = Boolean(from && to);

  const stay = useMemo(
    () =>
      computeStayTotals({
        myRentDays,
        prices,
        discounts,
        from,
        to,
      }),
    [myRentDays, prices, discounts, from, to]
  );

  const bookEnabled = hasDates && stay && !stay.unavailable && !stay.invalid;

  return (
    <div className={cn("rounded-md bg-slate-50 shadow", className)}>
      <div className="p-6">
        <div className="flex justify-between items-start gap-3">
          <h5 className="text-2xl font-medium">{t("stay-summary")}</h5>
        </div>

        <ul className="list-none mt-4">
          <li className="flex justify-between items-start gap-3">
            <span className="text-slate-400 text-sm pt-0.5">
              {t("check-in-out")}
            </span>
            <div className="text-right min-w-0">
              <CustomDayPicker
                variant="link"
                priceRanges={prices}
                unavailableRanges={occupiedRanges}
                myRentDays={myRentDays}
                selected={query.dateRange}
                placeholder={t("select-dates")}
              />
              {(errors.dateFrom || errors.dateTo) && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.dateFrom?.[0] || errors.dateTo?.[0]}
                </div>
              )}
            </div>
          </li>

          <li className="flex justify-between items-center gap-3 mt-3">
            <label htmlFor="summary-guests" className="text-slate-400 text-sm">
              {t("guests")}
              {hasDates && stay?.nights ? (
                <span className="text-slate-400">
                  {" "}
                  · {t("nights-count", { count: stay.nights })}
                </span>
              ) : null}
            </label>
            <div className="w-20">
              <input
                id="summary-guests"
                type="text"
                inputMode="numeric"
                className={cn(
                  "form-input py-1.5 text-sm text-right",
                  errors.guests && "!border-red-600"
                )}
                value={query.guests}
                onChange={(e) => updateQuery({ guests: e.target.value })}
              />
              {errors.guests ? (
                <span className="text-xs text-red-600">{errors.guests[0]}</span>
              ) : null}
            </div>
          </li>

          {!hasDates ? (
            <li className="mt-4 text-sm text-slate-400">
              {t("select-dates-hint")}
            </li>
          ) : stay?.unavailable ? (
            <li className="mt-4 text-sm text-slate-400">
              {t("pricing-unavailable")}
            </li>
          ) : stay?.invalid ? (
            <li className="mt-4 text-sm text-slate-400">
              {t("pricing-invalid")}
            </li>
          ) : stay ? (
            <>
              {stay.hasDiscount ? (
                <>
                  <li className="flex justify-between items-center mt-3">
                    <span className="text-slate-400 text-sm">
                      {t("base-price")}
                    </span>
                    <span className="font-medium text-sm">
                      {currency(stay.basePrice)}
                    </span>
                  </li>
                  <li className="flex justify-between items-center mt-2">
                    <span className="text-slate-400 text-sm">
                      {t("discount")}
                    </span>
                    <span className="font-medium text-sm">
                      −{currency(stay.basePrice - stay.priceWithDiscount)}
                    </span>
                  </li>
                </>
              ) : null}

              <li className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-700">
                  {t("stay-total")}
                </span>
                <span className="font-semibold text-sm">
                  {currency(stay.priceWithDiscount)}
                </span>
              </li>

              <li className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-slate-700">
                  {t("amount-due", { percent: stay.percent })}
                </span>
                <span className="font-semibold text-sm text-green-700">
                  {currency(stay.amountDue)}
                </span>
              </li>

              {stay.percent !== 100 ? (
                <li className="mt-1">
                  <p className="text-xs text-slate-500">{t("deposit-hint-30")}</p>
                </li>
              ) : null}

              {deposit != null && deposit !== "" && Number(deposit) > 0 ? (
                <li className="flex justify-between items-start mt-3 pt-3 border-t border-slate-200">
                  <span className="text-slate-400 text-sm">
                    {t("safety-deposit")}
                    <span className="block text-xs text-slate-400 mt-0.5">
                      {t("safety-deposit-at-checkin")}
                    </span>
                  </span>
                  <span className="font-medium text-sm text-slate-500">
                    {currency(deposit)}
                  </span>
                </li>
              ) : null}
            </>
          ) : null}
        </ul>

        {errors._form ? (
          <div className="mt-3 text-sm text-red-600">{errors._form[0]}</div>
        ) : null}

        <button
          type="button"
          disabled={pending || (canBookOnline ? !bookEnabled : !hasDates)}
          onClick={canBookOnline ? onBookNow : onInquiry}
          className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full mt-6 disabled:opacity-60"
        >
          {canBookOnline ? t("book-now") : t("send-inquiry")}
        </button>
      </div>
    </div>
  );
}
