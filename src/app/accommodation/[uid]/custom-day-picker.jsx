"use client";

import { isAfter, isBefore, startOfToday } from "date-fns";
import { enGB } from "date-fns/locale";
import { useState } from "react";
import { useMedia } from "react-use";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import {
  hasValidEndDates,
  isDateAvailable,
  isDateInOccupiedRanges,
  isEndDateValid,
  isInvalidSelection,
} from "@/lib/cal-utils";
import { df } from "@/lib/utils";

export default function CustomDayPicker({ priceRanges, unavailableRanges }) {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const today = startOfToday();

  const isMobile = useMedia("(max-width: 767px)", true);

  const handleDayClick = (date) => {
    const { from, to } = selectedRange;

    if (isBefore(date, today)) return;

    if (!from) {
      if (
        isDateAvailable(date, priceRanges, unavailableRanges) &&
        hasValidEndDates(date, priceRanges, unavailableRanges) &&
        isAfter(date, today)
      ) {
        setSelectedRange({ from: date, to: null });
      }
      return;
    }

    if (from && !to) {
      if (isEndDateValid(from, date, priceRanges, unavailableRanges)) {
        setSelectedRange({ from, to: date });
      }
    } else {
      setSelectedRange({ from: date, to: null });
    }
  };

  const modifiers = {
    available: (date) => {
      if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
        return (
          !isBefore(date, today) &&
          isDateAvailable(date, priceRanges, unavailableRanges) &&
          hasValidEndDates(date, priceRanges, unavailableRanges)
        );
      }

      return isEndDateValid(
        selectedRange.from,
        date,
        priceRanges,
        unavailableRanges
      );
    },
    unavailable: (date) =>
      !isBefore(date, today) && isDateInOccupiedRanges(date, unavailableRanges),
    invalidSelection: (date) =>
      isInvalidSelection(date, selectedRange, priceRanges, unavailableRanges),
    past: (date) => isBefore(date, today),
  };

  const modifiersStyles = {
    available: { color: "green" },
    unavailable: {
      color: "red",
      textDecoration: "line-through",
    },
    invalidSelection: {
      color: "orange",
      textDecoration: "dotted underline",
    },
    past: {
      color: "gray",
      textDecoration: "none",
    },
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
          locale={enGB}
          mode="range"
          fixedWeeks
          numberOfMonths={isMobile ? 1 : 2} // Show 2 months on desktop and 1 on mobile
          className="p-3"
          excludeDisabled
          selected={selectedRange}
          onDayClick={handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={(date) =>
            isBefore(date, today) || !modifiers.available(date)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
