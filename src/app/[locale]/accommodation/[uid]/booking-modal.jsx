"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";

import { cn, currency, df } from "@/lib/utils";

export default function BookingModal({
  open,
  onClose,
  mode = "book",
  quote,
  guests,
  dateRange,
  deposit,
  paymentMethod,
  onPaymentMethodChange,
  name,
  email,
  phone,
  message,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onMessageChange,
  pending,
  errors,
  onConfirm,
}) {
  const t = useTranslations("booking");
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);
  const isBook = mode === "book";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") onCloseRef.current();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || !open || !dateRange?.from || !dateRange?.to) return null;
  if (isBook && !quote) return null;

  const hasStayDiscount =
    quote && quote.subtotalBeforeDiscount !== quote.subtotal;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
      role="presentation"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative z-10 w-full max-w-2xl max-h-[min(92vh,100%)] overflow-y-auto rounded-xl bg-white shadow-xl"
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3">
          <h2 id="booking-modal-title" className="text-lg font-semibold">
            {isBook ? t("modal-title") : t("inquiry-title")}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label={t("close")}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form
          className="px-5 py-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          {quote ? (
            <div className="rounded-md bg-slate-50 px-4 py-3 text-sm">
              <h3 className="font-medium mb-2">{t("stay-summary")}</h3>
              <ul className="list-none space-y-1.5">
                <li className="flex justify-between items-baseline gap-4">
                  <span className="text-slate-500 shrink-0">
                    {t("check-in-out")}
                  </span>
                  <span className="font-medium text-right">
                    {df(dateRange.from, "PP")} – {df(dateRange.to, "PP")}
                  </span>
                </li>
                <li className="flex justify-between items-baseline gap-4">
                  <span className="text-slate-500">
                    {t("guests-and-nights", {
                      guests,
                      nights: quote.nights,
                    })}
                  </span>
                </li>
                {hasStayDiscount ? (
                  <>
                    <li className="flex justify-between items-baseline gap-4">
                      <span className="text-slate-500">{t("base-price")}</span>
                      <span className="font-medium">
                        {currency(quote.subtotalBeforeDiscount)}
                      </span>
                    </li>
                    <li className="flex justify-between items-baseline gap-4">
                      <span className="text-slate-500">{t("discount")}</span>
                      <span className="font-medium">
                        −
                        {currency(
                          quote.subtotalBeforeDiscount - quote.subtotal
                        )}
                      </span>
                    </li>
                  </>
                ) : null}
                {quote.bankDiscountPercent > 0 ? (
                  <li className="flex justify-between items-baseline gap-4">
                    <span className="text-slate-500">
                      {t("bank-discount-label", {
                        percent: quote.bankDiscountPercent,
                      })}
                    </span>
                    <span className="font-medium">
                      −{currency(quote.subtotal - quote.total)}
                    </span>
                  </li>
                ) : null}
                <li className="flex justify-between items-baseline gap-4 pt-1.5 mt-0.5 border-t border-slate-200">
                  <span className="text-slate-700 font-medium">
                    {t("stay-total")}
                  </span>
                  <span className="font-semibold text-base">
                    {currency(quote.total)}
                  </span>
                </li>
                {isBook ? (
                  <>
                    <li className="flex justify-between items-baseline gap-4">
                      <span className="text-slate-700 font-medium">
                        {t("amount-due", { percent: quote.percent })}
                      </span>
                      <span className="font-semibold text-base text-green-700">
                        {currency(quote.amountDue)}
                      </span>
                    </li>
                    {quote.percent !== 100 ? (
                      <li>
                        <p className="text-xs text-slate-500">
                          {t("deposit-hint-30")}
                          {quote.bankDiscountPercent > 0
                            ? ` ${t("bank-discount-hint")}`
                            : null}
                        </p>
                      </li>
                    ) : quote.bankDiscountPercent > 0 ? (
                      <li>
                        <p className="text-xs text-slate-500">
                          {t("bank-discount-hint")}
                        </p>
                      </li>
                    ) : null}
                  </>
                ) : null}
                {deposit != null && deposit !== "" && Number(deposit) > 0 ? (
                  <li className="flex justify-between items-baseline gap-4 pt-1.5 mt-0.5 border-t border-slate-200">
                    <span className="text-slate-500">
                      {t("safety-deposit")}
                      <span className="block text-xs text-slate-400">
                        {t("safety-deposit-at-checkin")}
                      </span>
                    </span>
                    <span className="font-medium text-slate-500">
                      {currency(deposit)}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : (
            <div className="rounded-md bg-slate-50 px-4 py-3 text-sm space-y-1.5">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-slate-500 shrink-0">
                  {t("check-in-out")}
                </span>
                <span className="font-medium text-right">
                  {df(dateRange.from, "PP")} – {df(dateRange.to, "PP")}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-slate-500">{t("guests")}</span>
                <span className="font-medium">{guests}</span>
              </div>
            </div>
          )}

          <div>
            <label className="font-medium text-sm" htmlFor="booking-name">
              {t("name")}
            </label>
            <input
              id="booking-name"
              name="name"
              type="text"
              className={cn(
                "form-input mt-1",
                errors?.name && "!border-red-600"
              )}
              placeholder={t("name")}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
            {errors?.name ? (
              <span className="text-xs text-red-600">{errors.name[0]}</span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-sm" htmlFor="booking-email">
                {t("email")}
              </label>
              <input
                id="booking-email"
                name="email"
                type="email"
                className={cn(
                  "form-input mt-1",
                  errors?.email && "!border-red-600"
                )}
                placeholder={t("email")}
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
              />
              {errors?.email ? (
                <span className="text-xs text-red-600">{errors.email[0]}</span>
              ) : null}
            </div>

            {isBook ? (
              <div>
                <label className="font-medium text-sm" htmlFor="booking-phone">
                  {t("phone")}
                </label>
                <input
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  className={cn(
                    "form-input mt-1",
                    errors?.phone && "!border-red-600"
                  )}
                  placeholder={t("phone")}
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                />
                {errors?.phone ? (
                  <span className="text-xs text-red-600">{errors.phone[0]}</span>
                ) : null}
              </div>
            ) : null}
          </div>

          {isBook ? (
            <div>
              <span className="font-medium text-sm">{t("payment-method")}</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <label
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer rounded-md border px-3 py-2 min-h-[42px]",
                    paymentMethod === "stripe"
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => onPaymentMethodChange("stripe")}
                  />
                  {t("pay-stripe")}
                </label>
                <label
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer rounded-md border px-3 py-2 min-h-[42px]",
                    paymentMethod === "bank"
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => onPaymentMethodChange("bank")}
                  />
                  {t("pay-bank")}
                </label>
              </div>
              {errors?.paymentMethod ? (
                <span className="text-xs text-red-600">
                  {errors.paymentMethod[0]}
                </span>
              ) : null}
            </div>
          ) : (
            <div>
              <label className="font-medium text-sm" htmlFor="booking-message">
                {t("message")}
              </label>
              <textarea
                id="booking-message"
                name="message"
                className="form-input mt-1 textarea w-full"
                placeholder={t("message-placeholder")}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {errors?._form ? (
            <div className="text-sm text-red-600">{errors._form[0]}</div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full disabled:opacity-60"
          >
            {pending
              ? t("submitting")
              : isBook
                ? paymentMethod === "bank"
                  ? t("confirm-bank")
                  : t("pay-with-stripe")
                : t("send-inquiry")}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
