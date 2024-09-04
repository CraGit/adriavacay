"use client";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { useSearch } from "@/providers/search-provider";
import { useState } from "react";
import { da, enGB } from "date-fns/locale";
import { useMedia } from "react-use";
import { cn, df } from "@/lib/utils";
import {
  differenceInDays,
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  isSaturday,
  isSunday,
  isWithinInterval,
} from "date-fns";

export default function CustomDayPicker({ unavailableDates, priceRanges }) {
  const { query } = useSearch();
  const [selectedRange, setSelectedRange] = useState(query.dateRange);

  const isMobile = useMedia("(max-width: 767px)", true);

  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        isSameDay(date, unavailableDate) || isBefore(date, new Date())
    );
  };

  const getApplicablePricing = (date) => {
    return priceRanges.find((pricing) =>
      isWithinInterval(date, {
        start: pricing.date_start,
        end: pricing.date_end,
      })
    );
  };

  const isValidCheckoutDate = (checkoutDate) => {
    if (!selectedRange.from) return true;

    const interval = { start: selectedRange.from, end: checkoutDate };
    const daysInRange = eachDayOfInterval(interval);

    let currentPeriodStart = selectedRange.from;
    for (let i = 0; i < daysInRange.length; i++) {
      const currentDay = daysInRange[i];
      const pricing = getApplicablePricing(currentDay);

      if (!pricing) return false;

      if (
        i === daysInRange.length - 1 ||
        !isWithinInterval(daysInRange[i + 1], {
          start: pricing.date_start,
          end: pricing.date_end,
        })
      ) {
        if (pricing.changeover_day !== "Flexible") {
          if (pricing.changeover_day === "Saturday" && !isSaturday(currentDay))
            return false;

          if (pricing.changeover_day === "Sunday" && !isSunday(currentDay))
            return false;
        }

        if (pricing.minimum_stay) {
          const stayLength =
            differenceInDays(currentDay, currentPeriodStart) + 1;

          if (stayLength < pricing.minimum_stay) return false;
        }

        currentPeriodStart = daysInRange[i + 1];
      }
    }

    return true;
  };

  const handleDayClick = (day, modifiers) => {
    if (modifiers.disabled) return;

    console.log(isValidCheckoutDate(day));
    if (!selectedRange.from) {
      setSelectedRange({ from: day, to: undefined });
    } else if (!selectedRange.to && isValidCheckoutDate(day)) {
      console.log({ valid: isValidCheckoutDate(day) });
      setSelectedRange({ ...selectedRange, to: day });
    } else {
      setSelectedRange({ from: day, to: undefined });
    }
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
          disabled={isDateUnavailable}
          onDayClick={handleDayClick}
          modifiers={{
            highlighted: selectedRange.from
              ? (date) => isValidCheckoutDate(date)
              : undefined,
          }}
          modifiersClassNames={{
            highlighted: "line-through",
            disabled: "text-green-500",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
