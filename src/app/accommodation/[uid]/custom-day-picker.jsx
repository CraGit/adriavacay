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
  isEndDateValid,
} from "@/lib/cal-utils";
import { cn, df } from "@/lib/utils";

export default function CustomDayPicker({
  priceRanges,
  unavailableRanges,
  className,
  selected,
  onSelect,
}) {
  const [selectedRange, setSelectedRange] = useState(selected);
  const today = startOfToday();

  const isMobile = useMedia("(max-width: 767px)", true);

  const handleDayClick = (date, modifiers) => {
    const { from, to } = selectedRange;

    if (from && !to && modifiers.selected) {
      setSelectedRange({ from: null, to: null });
      onSelect({ from: null, to: null });
      return;
    }

    if (!from || (from && to)) {
      if (
        isDateAvailable(date, priceRanges, unavailableRanges) &&
        hasValidEndDates(date, priceRanges, unavailableRanges) &&
        isAfter(date, today)
      ) {
        setSelectedRange({ from: date, to: null });
        onSelect({ from: date, to: null });
      }
    } else if (from && !to) {
      if (isEndDateValid(from, date, priceRanges, unavailableRanges)) {
        setSelectedRange({ from, to: date });
        onSelect({ from, to: date });
      } else {
        alert("Invalid date selected");
      }
    } else {
      setSelectedRange({ from: date, to: null });
      onSelect({ from: date, to: null });
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

      return (
        isAfter(date, selectedRange.from) &&
        isEndDateValid(selectedRange.from, date, priceRanges, unavailableRanges)
      );
    },
    /*unavailable: (date) =>
      !isBefore(date, today) && isDateInOccupiedRanges(date, unavailableRanges),
    invalidSelection: (date) =>
      isInvalidSelection(date, selectedRange, priceRanges, unavailableRanges),
    past: (date) => isBefore(date, today),*/
  };

  const modifiersClassNames = {
    available: "text-green-600 font-bold",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn("form-input", className)}>
          {selectedRange?.from ? (
            selectedRange.to ? (
              <>
                {df(selected.from, "PP")} - {df(selected.to, "PP")}
              </>
            ) : (
              df(selected.from, "PP")
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
          modifiersClassNames={modifiersClassNames}
          disabled={(date) => isBefore(date, today)}
          onSelect={(range) => console.log("ONSELECT")}
        />
      </PopoverContent>
    </Popover>
  );
}
