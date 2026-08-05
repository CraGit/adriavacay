"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import {
  createBankTransferBooking,
  createStripeCheckoutBooking,
  submitInquiry,
} from "@/actions/booking";
import {
  applyBankTransferDiscount,
  BANK_TRANSFER_DISCOUNT_PERCENT,
  calculateDeposit,
} from "@/lib/deposit";
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
import { useSearch } from "@/providers/search-provider";
import CustomDayPicker from "./custom-day-picker";

export default function BookingForm({
  uid,
  occupiedRanges,
  priceRanges,
  discounts = [],
  myRentDays,
  className,
}) {
  const { query, updateQuery } = useSearch();
  const locale = useLocale();
  const t = useTranslations("booking");

  const canBookOnline = Boolean(myRentDays);
  const [mode, setMode] = useState("inquiry");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});

  const quotePreview = useMemo(() => {
    const from = query.dateRange?.from;
    const to = query.dateRange?.to;
    if (!from || !to) return null;

    let total = 0;
    if (myRentDays) {
      total = myRentCalculatePriceWithDiscount(myRentDays, discounts, from, to);
      if (total <= 0) {
        total = myRentCalculatePrice(myRentDays, from, to);
      }
    } else if (priceRanges?.length) {
      total = calculateTotalPriceWithDiscount(priceRanges, discounts, from, to);
      if (total <= 0) {
        total = calculateTotalPrice(priceRanges, from, to);
      }
    }

    if (total <= 0) return null;
    const subtotal = total;
    const bankDiscountApplied = paymentMethod === "bank";
    const discountedTotal = bankDiscountApplied
      ? applyBankTransferDiscount(subtotal)
      : subtotal;
    const deposit = calculateDeposit(discountedTotal, from);
    const nights = differenceInCalendarDays(to, from);
    return {
      subtotal,
      total: discountedTotal,
      bankDiscountPercent: bankDiscountApplied
        ? BANK_TRANSFER_DISCOUNT_PERCENT
        : 0,
      ...deposit,
      nights,
    };
  }, [query.dateRange, myRentDays, priceRanges, discounts, paymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);
    formData.set("phone", phone);

    try {
      let result;
      if (mode === "inquiry") {
        result = await submitInquiry(
          uid,
          query.dateRange,
          query.guests,
          locale,
          formData
        );
      } else if (paymentMethod === "bank") {
        result = await createBankTransferBooking(
          uid,
          query.dateRange,
          query.guests,
          locale,
          formData
        );
      } else {
        result = await createStripeCheckoutBooking(
          uid,
          query.dateRange,
          query.guests,
          locale,
          formData
        );
      }

      if (result?.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      // redirect() throws in Next.js — ignore NEXT_REDIRECT
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw error;
      }
      setErrors({ _form: [error.message || t("error-generic")] });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("rounded-md px-4 py-2 shadow", className)}>
        {canBookOnline ? (
          <div className="flex gap-2 mb-3 mt-1">
            <button
              type="button"
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium border",
                mode === "inquiry"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-700 border-slate-200"
              )}
              onClick={() => setMode("inquiry")}
            >
              {t("mode-inquiry")}
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium border",
                mode === "book"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-700 border-slate-200"
              )}
              onClick={() => setMode("book")}
            >
              {t("mode-book")}
            </button>
          </div>
        ) : null}

        <div className="grid">
          <div className="lg:col-span-6 mb-1">
            <label className="font-medium text-sm">{t("dates")}</label>
            <CustomDayPicker
              className={cn(
                "mt-2",
                (errors.dateFrom || errors.dateTo) && "!border-red-600"
              )}
              priceRanges={priceRanges}
              unavailableRanges={occupiedRanges}
              myRentDays={myRentDays}
              selected={query.dateRange}
              onSelect={(range) => updateQuery({ dateRange: range })}
              placeholder={t("pick")}
            />
            {errors.dateFrom && (
              <span className="text-xs">{errors.dateFrom[0]}</span>
            )}
            {errors.dateFrom && errors.dateTo && <br />}
            {errors.dateTo && (
              <span className="text-xs">{errors.dateTo[0]}</span>
            )}
          </div>

          <div className="lg:col-span-1 mb-1">
            <label className="font-medium text-sm">{t("guests")}</label>
            <input
              type="text"
              className={cn(
                "form-input mt-1",
                errors.guests && "!border-red-600"
              )}
              value={query.guests}
              onChange={(e) => updateQuery({ guests: e.target.value })}
            />
            {errors.guests && (
              <span className="text-xs">{errors.guests[0]}</span>
            )}
          </div>

          <div className="lg:col-span-5 mb-1 ml-4">
            <label className="font-medium text-sm">{t("name")}</label>
            <input
              name="name"
              type="text"
              className={cn(
                "form-input mt-1",
                errors.name && "!border-red-600"
              )}
              placeholder={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="text-xs">{errors.name[0]}</span>}
          </div>

          <div className="lg:col-span-6 mb-1">
            <label className="font-medium text-sm">{t("email")}</label>
            <input
              name="email"
              type="email"
              className={cn(
                "form-input mt-1",
                errors.email && "!border-red-600"
              )}
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="text-xs">{errors.email[0]}</span>}
          </div>

          {mode === "book" ? (
            <div className="lg:col-span-6 mb-1">
              <label className="font-medium text-sm">{t("phone")}</label>
              <input
                name="phone"
                type="tel"
                className={cn(
                  "form-input mt-1",
                  errors.phone && "!border-red-600"
                )}
                placeholder={t("phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <span className="text-xs">{errors.phone[0]}</span>
              )}
            </div>
          ) : (
            <div className="lg:col-span-6 mb-1">
              <label className="font-medium text-sm">{t("message")}</label>
              <textarea
                name="message"
                className="form-input mt-2 textarea w-full"
                placeholder={t("message-placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {mode === "book" && quotePreview ? (
            <div className="lg:col-span-6 mb-3 mt-2 rounded-md bg-slate-50 p-3 text-sm">
              <div className="flex justify-between">
                <span>{t("stay-total")}</span>
                <span className="font-medium">
                  {currency(quotePreview.total)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>
                  {t("amount-due", { percent: quotePreview.percent })}
                </span>
                <span className="font-medium text-green-700">
                  {currency(quotePreview.amountDue)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {quotePreview.percent === 30
                  ? t("deposit-hint-30")
                  : t("deposit-hint-100")}
              </p>
              {quotePreview.bankDiscountPercent > 0 ? (
                <p className="text-xs text-slate-500 mt-1">
                  {t("bank-discount-hint")}
                </p>
              ) : null}
            </div>
          ) : null}

          {mode === "book" ? (
            <div className="lg:col-span-6 mb-2">
              <label className="font-medium text-sm">{t("payment-method")}</label>
              <div className="mt-2 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  {t("pay-stripe")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  />
                  {t("pay-bank")}
                </label>
              </div>
              {errors.paymentMethod && (
                <span className="text-xs">{errors.paymentMethod[0]}</span>
              )}
            </div>
          ) : null}

          {errors._form ? (
            <div className="lg:col-span-6 mb-2 text-sm text-red-600">
              {errors._form[0]}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex mt-6">
        <div className="flex-grow">
          <button
            type="submit"
            disabled={pending}
            className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full disabled:opacity-60"
          >
            {pending
              ? t("submitting")
              : mode === "inquiry"
                ? t("send-inquiry")
                : paymentMethod === "bank"
                  ? t("confirm-bank")
                  : t("pay-with-stripe")}
          </button>
        </div>
      </div>
    </form>
  );
}
