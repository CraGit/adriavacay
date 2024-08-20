import ical from "@/lib/cal-parser";
import { clsx } from "clsx";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isBefore,
  isWithinInterval,
  max,
  min,
  parse,
  subDays,
} from "date-fns";
import { enGB } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const df = (date, formatStr = "PP") =>
  format(date, formatStr, { locale: enGB });

export const occupiedDatesFromIcal = async (url) => {
  const dates = [];

  const res = await fetch(url);
  const text = await res.text();

  ical(text).forEach((e) => {
    const startDate = addDays(e.startDate, 1);
    const endDate = subDays(e.endDate, 1);

    const interval = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    dates.push(...interval);
  });

  return dates;
};

export const hasOverlap = (range, excludedDates) => {
  return excludedDates.some((d) =>
    isWithinInterval(d, { start: range[0], end: range[1] })
  );
};

export const calculateTotalPrice = (priceRanges, fromDate, toDate) => {
  let totalPrice = 0;

  priceRanges.forEach((range) => {
    const overlapStart = max([
      parse(range.date_start, "yyyy-MM-dd", new Date()),
      fromDate,
    ]);
    const overlapEnd = min([
      parse(range.date_end, "yyyy-MM-dd", new Date()),
      toDate,
    ]);

    if (!isBefore(overlapEnd, overlapStart)) {
      const daysInRange =
        differenceInCalendarDays(overlapEnd, overlapStart) + 1;
      totalPrice += daysInRange * range.price;
    }
  });

  return totalPrice;
};
