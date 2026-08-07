"use client";

import { isAfter, isBefore, isSameDay, startOfToday } from "date-fns";
import { enGB } from "date-fns/locale";
import { useMedia } from "react-use";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import {
  hasValidEndDates,
  isDateAvailable,
  isDateInOccupiedRanges,
  isEndDateValid,
  isValidForCheckIn,
} from "@/lib/cal-utils";
import {
  myRentIsValidCheckIn,
  myRentIsEndDateValid,
  myRentHasValidEndDates,
} from "@/lib/myrent-utils";
import { cn, df } from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";

const DayButton = (props, priceRanges, unavailableRanges, myRentDays) => {
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

    if (myRentDays !== undefined) {
      // --- MyRent mode ---
      if (!myRentDays) return; // API error: calendar is blocked, clicks do nothing

      if (!from || (from && to)) {
        if (
          myRentIsValidCheckIn(date, myRentDays) &&
          myRentHasValidEndDates(date, myRentDays) &&
          !isBefore(date, today)
        ) {
          updateQuery({ dateRange: { from: date, to: null } });
        }
      } else if (from && !to) {
        if (isBefore(date, from)) {
          if (
            myRentIsValidCheckIn(date, myRentDays) &&
            myRentHasValidEndDates(date, myRentDays) &&
            !isBefore(date, today)
          ) {
            updateQuery({ dateRange: { from: date, to: null } });
          } else {
            alert("Invalid date selected");
          }
          return;
        }
        if (myRentIsEndDateValid(from, date, myRentDays)) {
          updateQuery({ dateRange: { from, to: date } });
        } else {
          alert("Invalid date selected");
        }
      } else {
        updateQuery({ dateRange: { from: date, to: null } });
      }
    } else {
      // --- Prismic / iCal mode (unchanged) ---
      if (!from || (from && to)) {
        if (
          isDateAvailable(date, priceRanges, unavailableRanges) &&
          hasValidEndDates(date, priceRanges, unavailableRanges) &&
          // allow selecting today as a valid check-in
          !isBefore(date, today)
        ) {
          updateQuery({ dateRange: { from: date, to: null } });
        }
      } else if (from && !to) {
        // If user clicked a date before the current start while picking an end,
        // treat it as a new start (same validation as above).
        if (isBefore(date, from)) {
          if (
            isDateAvailable(date, priceRanges, unavailableRanges) &&
            hasValidEndDates(date, priceRanges, unavailableRanges) &&
            !isBefore(date, today)
          ) {
            updateQuery({ dateRange: { from: date, to: null } });
          } else {
            alert("Invalid date selected");
          }
          return;
        }
        if (isEndDateValid(from, date, priceRanges, unavailableRanges)) {
          updateQuery({ dateRange: { from, to: date } });
        } else {
          alert("Invalid date selected");
        }
      } else {
        updateQuery({ dateRange: { from: date, to: null } });
      }
    }
  };
  return <button {...buttonProps} onClick={handleClick} />;
};

export default function CustomDayPicker({
  priceRanges,
  unavailableRanges,
  myRentDays,
  className,
  selected,
  placeholder,
  variant = "input",
}) {
  const today = startOfToday();

  const isMobile = useMedia("(max-width: 767px)", true);

  const label = selected?.from ? (
    selected.to ? (
      <>
        {df(selected.from, "PP")} - {df(selected.to, "PP")}
      </>
    ) : (
      df(selected.from, "PP")
    )
  ) : (
    <span>{placeholder}</span>
  );

  const modifiers = {
    available: (date) => {
      // Special case: if this is the checkout date, consider it available
      if (selected.to && isSameDay(date, selected.to)) return true;

      if (myRentDays !== undefined) {
        // --- MyRent mode ---
        if (!myRentDays) return false;

        if (!selected.from || (selected.from && selected.to)) {
          return (
            myRentIsValidCheckIn(date, myRentDays) &&
            myRentHasValidEndDates(date, myRentDays)
          );
        }
        return (
          isAfter(date, selected.from) &&
          myRentIsEndDateValid(selected.from, date, myRentDays)
        );
      }

      // --- Prismic / iCal mode (unchanged) ---
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
  };

  const modifiersClassNames = {
    available: "text-green-600 font-bold",
    range_end:
      "text-white bg-green-600 hover:bg-green-700 rounded-r-full !font-bold",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {variant === "link" ? (
          <button
            type="button"
            className={cn(
              "text-sm font-medium text-green-600 hover:text-green-700 underline underline-offset-2 text-right",
              className
            )}
          >
            {label}
          </button>
        ) : (
          <div className={cn("form-input cursor-pointer", className)}>{label}</div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="end">
        <DayPicker
          locale={enGB}
          mode="range"
          fixedWeeks
          numberOfMonths={isMobile ? 1 : 2} // Show 2 months on desktop and 1 on mobile
          className="p-3"
          excludeDisabled
          selected={selected}
          modifiers={{
            ...modifiers,
            // Force the end date (to) to be styled as range_end
            range_end: selected.to ? [selected.to] : undefined,
          }}
          modifiersClassNames={modifiersClassNames}
          disabled={(date) => {
            // Always disable past dates
            if (isBefore(date, today)) return true;

            // Special case: if this is the checkout date we've selected, don't disable it
            if (selected.to && isSameDay(date, selected.to)) return false;

            if (myRentDays !== undefined) {
              // --- MyRent mode ---
              if (!myRentDays) return true; // API error: block all days

              // When picking start (no from selected, or range is complete): enforce check-in validity
              if (!selected.from || (selected.from && selected.to)) {
                return !myRentIsValidCheckIn(date, myRentDays);
              }

              // When picking end date: don't pre-disable — validate on click
              return false;
            }

            // --- Prismic / iCal mode (unchanged) ---
            // If no start date selected, use check-in validation
            if (!selected.from || (selected.from && selected.to)) {
              return (
                !isValidForCheckIn(date, unavailableRanges) ||
                !isDateAvailable(date, priceRanges, unavailableRanges)
              );
            }

            // If start date selected and picking end date, allow more flexibility
            // The actual validation will be done in the DayButton click handler
            return false;
          }}
          components={{
            DayButton: (props) =>
              DayButton(props, priceRanges, unavailableRanges, myRentDays),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
