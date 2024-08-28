"use client";

import { addDays, compareAsc } from "date-fns";
import { useState } from "react";

import { df } from "@/lib/utils";

import { DayPicker } from "./DayPicker";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { enGB } from "date-fns/locale";
import { useMedia } from "react-use";

export const DateRangePicker = ({ selected, onSelect }) => {
  const [selectedRange, setSelectedRange] = useState();
  const [count, setCount] = useState(0);

  const isMobile = useMedia("(max-width: 767px)");

  const handleSelect = (selectedDay) => {
    let range;

    if (count === 0) {
      range = {
        from: selectedDay,
        to: addDays(selectedDay, 7),
      };
    }

    if (count === 1) {
      if (compareAsc(selectedRange.from, selectedDay) < 0)
        range = {
          from: selectedRange?.from,
          to: selectedDay,
        };
      else {
        range = {
          from: selectedDay,
          to: selectedRange?.from,
        };
      }
    }

    setCount((prev) => (prev + 1 === 2 ? 0 : prev + 1));

    setSelectedRange(range);

    onSelect(range);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0">
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
          onDayClick={handleSelect}
          disabled={{ before: new Date() }}
          showOutsideDays={false}
          numberOfMonths={isMobile ? 1 : 2} // Show 2 months on desktop and 1 on mobile
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
};
