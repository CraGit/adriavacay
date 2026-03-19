"use client";

import { useState } from "react";

import { submitBooking } from "@/actions/booking";
import { DateRangePicker } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";
import CustomDayPicker from "./custom-day-picker";
import { useTranslations } from "next-intl";

export default function BookingForm({
  uid,
  occupiedDates,
  occupiedRanges,
  priceRanges,
  myRentDays,
  className,
}) {
  const { query, updateQuery } = useSearch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  //const onSubmit = submitBooking.bind(null, uid, query.dateRange, query.guests);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitBooking(
      uid,
      query.dateRange,
      query.guests,
      formData
    );

    if (result?.errors) {
      setErrors(result.errors);
    }
  };

  const t = useTranslations("booking");

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("rounded-md px-4 py-2 shadow", className)}>
        {/* <h3 className="mb-2 text-lg leading-normal font-medium">Booking Form</h3> */}

        <div className="grid">
          <div className="lg:col-span-6 mb-1">
            <label className="font-medium text-sm">{t("dates")}</label>
            {/* <DateRangePicker
              selected={query.dateRange}
              onSelect={(range) => updateQuery({ dateRange: range })}
              className={cn(
                "mt-2",
                (errors.dateFrom || errors.dateTo) && "border-red-600"
              )}
              disabledDates={occupiedDates}
            /> */}
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
            <label className="font-medium text-sm">Email:</label>
            <input
              name="email"
              type="email"
              className={cn(
                "form-input mt-1",
                errors.email && "!border-red-600"
              )}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="text-xs">{errors.email[0]}</span>}
          </div>

          {/* <div>
            <label className="font-medium text-sm">Your Message</label>
            <textarea
              className="form-input mt-2 textarea w-full"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div> */}
        </div>
      </div>
      <div className="flex mt-6">
        <div className="flex-grow">
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
          >
            {t("book-now")}
          </button>
        </div>
      </div>
    </form>
  );
}
