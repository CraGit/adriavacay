import { clsx } from "clsx";
import {
  addDays,
  subDays,
  eachDayOfInterval,
  format,
  isWithinInterval,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { enGB } from "date-fns/locale";
import ical from "@/lib/cal-parser";

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
