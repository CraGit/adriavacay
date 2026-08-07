"use client";

import { useCallback, useMemo, useState } from "react";
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
} from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";
import BookingModal from "./booking-modal";
import PriceDisplay from "./price-display";

export default function BookingForm({
  uid,
  occupiedRanges,
  priceRanges,
  discounts = [],
  myRentDays,
  deposit,
  className,
}) {
  const { query } = useSearch();
  const locale = useLocale();
  const t = useTranslations("booking");

  const canBookOnline = Boolean(myRentDays);
  const [modalOpen, setModalOpen] = useState(false);
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

    let subtotalBeforeDiscount = 0;
    let subtotal = 0;

    if (myRentDays) {
      subtotalBeforeDiscount = myRentCalculatePrice(myRentDays, from, to);
      subtotal = myRentCalculatePriceWithDiscount(
        myRentDays,
        discounts,
        from,
        to
      );
      if (subtotal <= 0) subtotal = subtotalBeforeDiscount;
    } else if (priceRanges?.length) {
      subtotalBeforeDiscount = calculateTotalPrice(priceRanges, from, to);
      subtotal = calculateTotalPriceWithDiscount(
        priceRanges,
        discounts,
        from,
        to
      );
      if (subtotal <= 0) subtotal = subtotalBeforeDiscount;
    }

    if (subtotal <= 0) return null;

    const bankDiscountApplied = paymentMethod === "bank";
    const discountedTotal = bankDiscountApplied
      ? applyBankTransferDiscount(subtotal)
      : subtotal;
    const depositCalc = calculateDeposit(discountedTotal, from);
    const nights = differenceInCalendarDays(to, from);

    return {
      subtotalBeforeDiscount,
      subtotal,
      total: discountedTotal,
      bankDiscountPercent: bankDiscountApplied
        ? BANK_TRANSFER_DISCOUNT_PERCENT
        : 0,
      ...depositCalc,
      nights,
    };
  }, [query.dateRange, myRentDays, priceRanges, discounts, paymentMethod]);

  const buildFormData = useCallback(() => {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);
    formData.set("phone", phone);
    return formData;
  }, [name, email, message, phone]);

  const validateDatesAndGuests = () => {
    const nextErrors = {};
    if (!query.dateRange?.from) nextErrors.dateFrom = [t("pick")];
    if (!query.dateRange?.to) nextErrors.dateTo = [t("pick")];
    if (!query.guests) nextErrors.guests = [t("guests-required")];
    return nextErrors;
  };

  const openModal = () => {
    setErrors({});
    const nextErrors = validateDatesAndGuests();
    if (canBookOnline && !quotePreview) {
      nextErrors._form = [t("error-generic")];
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setModalOpen(true);
  };

  const submitBooking = useCallback(async () => {
    setPending(true);
    setErrors({});

    const formData = buildFormData();

    try {
      const result =
        paymentMethod === "bank"
          ? await createBankTransferBooking(
              uid,
              query.dateRange,
              query.guests,
              locale,
              formData
            )
          : await createStripeCheckoutBooking(
              uid,
              query.dateRange,
              query.guests,
              locale,
              formData
            );

      if (result?.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw error;
      }
      setErrors({ _form: [error.message || t("error-generic")] });
    } finally {
      setPending(false);
    }
  }, [
    buildFormData,
    paymentMethod,
    uid,
    query.dateRange,
    query.guests,
    locale,
    t,
  ]);

  const submitInquiryForm = useCallback(async () => {
    setPending(true);
    setErrors({});

    const formData = buildFormData();

    try {
      const result = await submitInquiry(
        uid,
        query.dateRange,
        query.guests,
        locale,
        formData
      );

      if (result?.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw error;
      }
      setErrors({ _form: [error.message || t("error-generic")] });
    } finally {
      setPending(false);
    }
  }, [buildFormData, uid, query.dateRange, query.guests, locale, t]);

  return (
    <>
      <PriceDisplay
        prices={priceRanges}
        discounts={discounts}
        deposit={deposit}
        myRentDays={myRentDays}
        occupiedRanges={occupiedRanges}
        canBookOnline={canBookOnline}
        pending={pending}
        errors={modalOpen ? {} : errors}
        onBookNow={openModal}
        onInquiry={openModal}
        className={className}
      />

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={canBookOnline ? "book" : "inquiry"}
        quote={quotePreview}
        guests={query.guests}
        dateRange={query.dateRange}
        deposit={deposit}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        name={name}
        email={email}
        phone={phone}
        message={message}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onMessageChange={setMessage}
        pending={pending}
        errors={errors}
        onConfirm={canBookOnline ? submitBooking : submitInquiryForm}
      />
    </>
  );
}
