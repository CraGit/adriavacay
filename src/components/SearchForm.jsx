"use client";

import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import Select from "react-select";
import { useTranslations } from "next-intl";
import qs from "query-string";

import { AiOutlineCalendar, GoPeople, GoHome } from "@/assets/icons/vander";
import { useSearch } from "@/providers/search-provider";

import { DateRangePicker } from "./DateRangePicker";
import { guestOptions } from "@/data";

export default function SearchForm() {
  const { query, updateQuery } = useSearch();
  const router = useRouter();

  const [dateRange, setDateRange] = useState(query.dateRange);
  const [guests, setGuests] = useState(query.guests);
  const [type, setType] = useState(query.type);

  const onSubmit = () => {
    updateQuery({
      dateRange,
      guests,
      type,
    });

    const href = qs.stringifyUrl({
      url: "/accommodation",
      query: {
        type: type === "All" ? undefined : type,
      },
    });

    router.push(href);
  };

  const t = useTranslations("search");

  const typeOptions = [
    { label: t("all-types"), value: "All" },
    { label: t("villa"), value: "Villa" },
    { label: t("cottage"), value: "Cottage" },
  ];

  return (
    <div>
      <div className="registration-form text-dark text-start">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="buy-min-price"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              {t("dates")}:
            </label>
            <div className="filter-search-form relative filter-border mt-2">
              <AiOutlineCalendar className="icons" />
              <DateRangePicker
                selected={dateRange}
                onSelect={(range) => setDateRange(range)}
                className="filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="buy-guests"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              {t("guests")}:
            </label>

            <div className="filter-search-form relative mt-2">
              <GoPeople className="icons" />
              <Select
                value={
                  guests ? guestOptions.find((x) => x.value === guests) : guests
                }
                onChange={(option) => setGuests(option ? option.value : option)}
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={guestOptions}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="buy-guests"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              {t("accommodation-type")}
            </label>

            <div className="filter-search-form relative mt-2">
              <GoHome className="icons" />
              <Select
                value={type ? typeOptions.find((x) => x.value === type) : type}
                onChange={(option) => setType(option ? option.value : option)}
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={typeOptions}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onSubmit}
              className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white searchbtn submit-btn w-full !h-[60px] lg:rounded-none rounded mt-2"
            >
              {t("search")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
