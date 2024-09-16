"use client";

import { isAfter, isBefore, startOfToday } from "date-fns";
import { enGB } from "date-fns/locale";
import { useMedia } from "react-use";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import {
  hasValidEndDates,
  isDateAvailable,
  isDateInOccupiedRanges,
  isEndDateValid,
} from "@/lib/cal-utils";
import { cn, df } from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";

const DayButton = (props, priceRanges, unavailableRanges) => {
  const {
    query: { dateRange },
    updateQuery,
  } = useSearch();
  const {
    day: { date },
    modifiers,
    ...buttonProps
  } = props;

  const today = startOfToday();

  const handleClick = () => {
    const { from, to } = dateRange;

    if (from && !to && modifiers.selected) {
      updateQuery({ dateRange: { from: null, to: null } });
      return;
    }

    if (!from || (from && to)) {
      if (
        isDateAvailable(date, priceRanges, unavailableRanges) &&
        hasValidEndDates(date, priceRanges, unavailableRanges) &&
        isAfter(date, today)
      ) {
        updateQuery({ dateRange: { from: date, to: null } });
      }
    } else if (from && !to) {
      if (isEndDateValid(from, date, priceRanges, unavailableRanges)) {
        updateQuery({ dateRange: { from, to: date } });
      } else {
        alert("Invalid date selected");
      }
    } else {
      updateQuery({ dateRange: { from: date, to: null } });
    }
  };
  return <button {...buttonProps} onClick={handleClick} />;
};

export default function CustomDayPicker({
  priceRanges,
  unavailableRanges,
  className,
  selected,
}) {
  const today = startOfToday();

  const isMobile = useMedia("(max-width: 767px)", true);

  const modifiers = {
    available: (date) => {
      if (!selected.from || (selected.from && selected.to)) {
        return (
          isDateAvailable(date, priceRanges, unavailableRanges) &&
          hasValidEndDates(date, priceRanges, unavailableRanges)
        );
      }

      return (
        isAfter(date, selected.from) &&
        isEndDateValid(selected.from, date, priceRanges, unavailableRanges)
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
          {selected?.from ? (
            selected.to ? (
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
          selected={selected}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={(date) =>
            isBefore(date, today) ||
            isDateInOccupiedRanges(date, unavailableRanges) ||
            !isDateAvailable(date, priceRanges, unavailableRanges)
          }
          components={{
            DayButton: (props) =>
              DayButton(props, priceRanges, unavailableRanges),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
