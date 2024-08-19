"use client";

import { useState } from "react";
import Select from "react-select";
import { isSaturday, nextSaturday } from "date-fns";

import { RxHome, GoPeople, AiOutlineCalendar } from "../assets/icons/vander";
import { DateRangePicker } from "./DateRangePicker";

export default function SearchForm() {
  let Houses = [
    { value: "villa", label: "Villa" },
    { value: "apartment", label: " Apartment" },
  ];
  // let minPrice = [
  //   { value: "1", label: "500" },
  //   { value: "2", label: "1000" },
  //   { value: "3", label: "2000" },
  //   { value: "4", label: "3000" },
  //   { value: "5", label: "4000" },
  //   { value: "5", label: "5000" },
  //   { value: "5", label: "6000" },
  // ];
  // let maxPrice = [
  //   { value: "1", label: "500" },
  //   { value: "2", label: "1000" },
  //   { value: "3", label: "2000" },
  //   { value: "4", label: "3000" },
  //   { value: "5", label: "4000" },
  //   { value: "5", label: "5000" },
  //   { value: "5", label: "6000" },
  // ];
  let Guests = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
  ];

  const [dateRange, setDateRange] = useState({
    from: isSaturday(new Date()) ? new Date() : nextSaturday(new Date()),
    to: isSaturday(new Date())
      ? nextSaturday(new Date())
      : nextSaturday(nextSaturday(new Date())),
  });

  return (
    <form action="#">
      <div className="registration-form text-dark text-start">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
          <div>
            <label
              htmlFor="buy-properties"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              Select Categories:
            </label>
            <div className="filter-search-form relative filter-border mt-2">
              <RxHome className=" icons" />
              <Select
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={Houses}
              />
            </div>
          </div>

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
                onSelect={(value) => setDateRange(value)}
              />
            </div>
          </div>

          {/* <div>
            <label
              htmlFor="buy-min-price"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              Min Price :
            </label>
            <div className="filter-search-form relative filter-border mt-2">
              <AiOutlineDollarCircle className="icons" />
              <Select
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={minPrice}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="buy-max-price"
              className="form-label text-slate-900 dark:text-white font-medium"
            >
              Max Price :
            </label>
            <div className="filter-search-form relative mt-2">
              <AiOutlineDollarCircle className="icons" />
              <Select
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={maxPrice}
              />
            </div>
          </div> */}

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
                className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                options={Guests}
              />
            </div>
          </div>

          <div className="lg:mt-6">
            <input
              type="submit"
              id="search-buy"
              name="search"
              className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white searchbtn submit-btn w-full !h-[60px] lg:rounded-none rounded mt-2"
              value="Search"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
