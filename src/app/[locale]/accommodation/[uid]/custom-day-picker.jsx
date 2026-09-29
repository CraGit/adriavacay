"use client";

import { isBefore, isSameDay, startOfToday } from "date-fns";
import { enGB } from "date-fns/locale";
import { useMedia } from "react-use";

import { DayPicker } from "@/components/DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import {
  hasValidEndDates,
  isDateAvailable,
  isEndDateValid,
  isValidForCheckIn,
} from "@/lib/cal-utils";
import {
  myRentIsValidCheckIn,
  myRentIsEndDateValid,
  myRentHasValidEndDates,
} from "@/lib/myrent-utils";
import {
  stayDateFromPickerDate,
  stayDateToUtcNoon,
  toStayDateISO,
} from "@/lib/stay-dates";
import { cn, df } from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";

/** Calendar-day order (safe for UTC-noon stored Dates vs picker local midnights). */
function stayDayBefore(a, b) {
  return toStayDateISO(a) < toStayDateISO(b);
}

function stayDayAfter(a, b) {
  return toStayDateISO(a) > toStayDateISO(b);
}

function toStayUtcNoonFromPicker(date) {
  return stayDateToUtcNoon(stayDateFromPickerDate(date));
}

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

    const stayDay = toStayUtcNoonFromPicker(date);

    if (myRentDays !== undefined) {
      // --- MyRent mode ---
      if (!myRentDays) return; // API error: calendar is blocked, clicks do nothing

      if (!from || (from && to)) {
        if (
          myRentIsValidCheckIn(stayDay, myRentDays) &&
          myRentHasValidEndDates(stayDay, myRentDays) &&
          !isBefore(date, today)
        ) {
          updateQuery({ dateRange: { from: stayDay, to: null } });
        }
      } else if (from && !to) {
        if (stayDayBefore(stayDay, from)) {
          if (
            myRentIsValidCheckIn(stayDay, myRentDays) &&
            myRentHasValidEndDates(stayDay, myRentDays) &&
            !isBefore(date, today)
          ) {
            updateQuery({ dateRange: { from: stayDay, to: null } });
          } else {
            alert("Invalid date selected");
          }
          return;
        }
        if (myRentIsEndDateValid(from, stayDay, myRentDays)) {
          updateQuery({ dateRange: { from, to: stayDay } });
        } else {
          alert("Invalid date selected");
        }
      } else {
        updateQuery({ dateRange: { from: stayDay, to: null } });
      }
    } else {
      // --- Prismic / iCal mode ---
      if (!from || (from && to)) {
        if (
          isDateAvailable(date, priceRanges, unavailableRanges) &&
          hasValidEndDates(date, priceRanges, unavailableRanges) &&
          !isBefore(date, today)
        ) {
          updateQuery({ dateRange: { from: stayDay, to: null } });
        }
      } else if (from && !to) {
        if (stayDayBefore(stayDay, from)) {
          if (
            isDateAvailable(date, priceRanges, unavailableRanges) &&
            hasValidEndDates(date, priceRanges, unavailableRanges) &&
            !isBefore(date, today)
          ) {
            updateQuery({ dateRange: { from: stayDay, to: null } });
          } else {
            alert("Invalid date selected");
          }
          return;
        }
        if (isEndDateValid(from, stayDay, priceRanges, unavailableRanges)) {
          updateQuery({ dateRange: { from, to: stayDay } });
        } else {
          alert("Invalid date selected");
        }
      } else {
        updateQuery({ dateRange: { from: stayDay, to: null } });
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

      const stayDay = toStayUtcNoonFromPicker(date);

      if (myRentDays !== undefined) {
        // --- MyRent mode ---
        if (!myRentDays) return false;

        if (!selected.from || (selected.from && selected.to)) {
          return (
            myRentIsValidCheckIn(stayDay, myRentDays) &&
            myRentHasValidEndDates(stayDay, myRentDays)
          );
        }
        return (
          stayDayAfter(stayDay, selected.from) &&
          myRentIsEndDateValid(selected.from, stayDay, myRentDays)
        );
      }

      // --- Prismic / iCal mode ---
      if (!selected.from || (selected.from && selected.to)) {
        return (
          isDateAvailable(date, priceRanges, unavailableRanges) &&
          hasValidEndDates(date, priceRanges, unavailableRanges)
        );
      }

      return (
        stayDayAfter(stayDay, selected.from) &&
        isEndDateValid(selected.from, stayDay, priceRanges, unavailableRanges)
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
          numberOfMonths={isMobile ? 1 : 2}
          className="p-3"
          excludeDisabled
          selected={selected}
          modifiers={{
            ...modifiers,
            range_end: selected.to ? [selected.to] : undefined,
          }}
          modifiersClassNames={modifiersClassNames}
          disabled={(date) => {
            if (isBefore(date, today)) return true;

            if (selected.to && isSameDay(date, selected.to)) return false;

            if (myRentDays !== undefined) {
              if (!myRentDays) return true;

              if (!selected.from || (selected.from && selected.to)) {
                return !myRentIsValidCheckIn(
                  toStayUtcNoonFromPicker(date),
                  myRentDays
                );
              }

              return false;
            }

            if (!selected.from || (selected.from && selected.to)) {
              return (
                !isValidForCheckIn(date, unavailableRanges) ||
                !isDateAvailable(date, priceRanges, unavailableRanges)
              );
            }

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
