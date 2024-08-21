"use client";

import { useState } from "react";
import Select from "react-select";
import { isSaturday, nextSaturday } from "date-fns";

import { RxHome, GoPeople, AiOutlineCalendar } from "../assets/icons/vander";
import { DateRangePicker } from "./DateRangePicker";
import { useSearch } from "@/providers/search-provider";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  let Guests = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
  ];

  const { updateQuery } = useSearch();
  const router = useRouter();

  const [category, setCategory] = useState("villa");
  const [dateRange, setDateRange] = useState({
    from: isSaturday(new Date()) ? new Date() : nextSaturday(new Date()),
    to: isSaturday(new Date())
      ? nextSaturday(new Date())
      : nextSaturday(nextSaturday(new Date())),
  });

  const [guests, setGuests] = useState(1);

  const onSubmit = () => {
    updateQuery({
      category,
      dateRange,
      guests,
    });
    router.push("/accommodation");
  };

  return (
    <div>
      <div className="registration-form text-dark text-start">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
          <div className="col-span-2">
            <label
              htmlFor="buy-min-price"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              Dates
            </label>
            <div className="filter-search-form relative filter-border mt-2">
              <AiOutlineCalendar className="icons" />
              <DateRangePicker
                selected={dateRange}
                onSelect={(range) => setDateRange(range)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="buy-guests"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              Guests :
            </label>

            <div className="filter-search-form relative mt-2">
              <GoPeople className="icons" />
              <Select
                value={guests ? Guests.find((x) => x.value === guests) : guests}
                onChange={(option) => setGuests(option ? option.value : option)}
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={Guests}
              />
            </div>
          </div>

          <div className="lg:mt-6">
            <button
              onClick={onSubmit}
              className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white searchbtn submit-btn w-full !h-[60px] lg:rounded-none rounded mt-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
