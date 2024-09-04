"use client";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { useSearch } from "@/providers/search-provider";
import { useState } from "react";
import { da, enGB } from "date-fns/locale";
import { useMedia } from "react-use";
import { cn, df, isDateInRange, isValidChangeoverDay } from "@/lib/utils";
import { differenceInCalendarDays, isBefore, isSameDay } from "date-fns";

export default function CustomDayPicker({ unavailableDates, priceRanges }) {
  //  console.log(priceRanges);
  const { query } = useSearch();
  const [selectedRange, setSelectedRange] = useState(query.dateRange);

  const isMobile = useMedia("(max-width: 767px)", true);

  const getApplicablePriceRange = (date) => {
    return priceRanges.find((range) => isDateInRange(date, range));
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some((d) => isSameDay(d, date));
  };

  const handleDayClick = (date, modifiers) => {
    const { from, to } = selectedRange;

    if (!from) {
      const startRange = getApplicablePriceRange(date);
      if (
        !startRange ||
        !isValidChangeoverDay(date, startRange.changeover_day) ||
        isDateUnavailable(date)
      ) {
        return;
      }

      setSelectedRange({ from: date, to: undefined });
      return;
    }

    if (from && !to) {
      const endRange = getApplicablePriceRange(date);
      if (
        !endRange ||
        !isValidChangeoverDay(date, endRange.changeover_day) ||
        isDateUnavailable(date)
      ) {
        return;
      }

      const totalDays = differenceInCalendarDays(date, from) + 1;

      const startRange = getApplicablePriceRange(from);

      if (
        startRange.changeover_day === "Flexible" &&
        startRange.minimum_stay &&
        totalDays < startRange.minimum_stay
      ) {
        return;
      }

      if (
        endRange.changeover_day === "Flexible" &&
        endRange.minimum_stay &&
        totalDays < endRange.minimum_stay
      ) {
        return;
      }

      setSelectedRange({ from, to: date });
    } else {
      setSelectedRange({ from: date, to: undefined });
    }
  };

  const modifiers = {
    available: (date) => {
      if (isDateUnavailable(date)) return false;

      const range = getApplicablePriceRange(date);

      if (!range) return false;

      if (!selectedRange.from) {
        return isValidChangeoverDay(date, range.changeover_day);
      }

      const startRange = getApplicablePriceRange(selectedRange.from);
      const totalDays = differenceInCalendarDays(date, selectedRange.from) + 1;

      const isValidEndDate =
        isDateInRange(date, range) &&
        isValidChangeoverDay(date, range.changeover_day) &&
        (!startRange.minimum_stay || totalDays >= startRange.minimum_stay) &&
        (!range.minimum_stay || totalDays >= range.minimum_stay);

      return isValidEndDate;
    },
    unavailable: (date) =>
      isBefore(date, new Date()) || !modifiers.available(date),
  };

  const modifiersClassNames = {
    available: "text-green-500",
    unavailable: "text-red-500",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="form-input">
          {selectedRange?.from ? (
            selectedRange.to ? (
              <>
                {df(selectedRange.from, "PP")} - {df(selectedRange.to, "PP")}
              </>
            ) : (
              df(selectedRange.from, "PP")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <DayPicker
          fixedWeeks
          locale={enGB}
          mode="range"
          className="p-3"
          numberOfMonths={isMobile ? 1 : 2} // Show 2 months on desktop and 1 on mobile
          selected={selectedRange}
          onDayClick={handleDayClick}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </PopoverContent>
    </Popover>
  );
}
