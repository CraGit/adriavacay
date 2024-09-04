import ical from "@/lib/cal-parser";
import { clsx } from "clsx";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
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

export const currency = (amount) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const occupiedDatesFromIcal = async (url) => {
  const dates = [];

  try {
    if (!url) return dates;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return dates;

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
  } catch (error) {
    return dates;
  }

  return dates;
};

export const hasOverlap = (range, excludedDates) => {
  return excludedDates.some((d) =>
    isWithinInterval(d, { start: range[0], end: range[1] })
  );
};

export const filterAvailablePriceRanges = (priceRanges, fromDate, toDate) => {
  return priceRanges.filter((range) => {
    const overlapStart = max([
      parse(range.date_start, "yyyy-MM-dd", new Date()),
      fromDate,
    ]);
    const overlapEnd = min([
      parse(range.date_end, "yyyy-MM-dd", new Date()),
      toDate,
    ]);

    return !isBefore(overlapEnd, overlapStart);
  });
};

export const calculateTotalPrice = (priceRanges, fromDate, toDate) => {
  const availablePriceRanges = filterAvailablePriceRanges(
    priceRanges,
    fromDate,
    toDate
  );
  let totalPrice = 0;

  availablePriceRanges.forEach((range) => {
    const overlapStart = max([
      parse(range.date_start, "yyyy-MM-dd", new Date()),
      fromDate,
    ]);
    const overlapEnd = min([
      parse(range.date_end, "yyyy-MM-dd", new Date()),
      toDate,
    ]);

    const daysInRange = differenceInCalendarDays(overlapEnd, overlapStart);

    totalPrice += daysInRange * range.price;
  });

  return Math.floor(totalPrice);
};

const getDiscountForDate = (date, discountRanges) => {
  for (const discount of discountRanges) {
    if (
      !isBefore(date, parse(discount.date_start, "yyyy-MM-dd", new Date())) &&
      !isAfter(date, parse(discount.date_end, "yyyy-MM-dd", new Date()))
    ) {
      return discount.percentage;
    }
  }

  return 0;
};

export const calculateTotalPriceWithDiscount = (
  priceRanges,
  discountRanges,
  fromDate,
  toDate
) => {
  const availablePriceRanges = filterAvailablePriceRanges(
    priceRanges,
    fromDate,
    toDate
  );
  let totalPrice = 0;

  availablePriceRanges.forEach((range) => {
    const overlapStart = max([
      parse(range.date_start, "yyyy-MM-dd", new Date()),
      fromDate,
    ]);
    const overlapEnd = min([
      parse(range.date_end, "yyyy-MM-dd", new Date()),
      toDate,
    ]);

    for (
      let date = overlapStart;
      isBefore(date, overlapEnd);
      date = addDays(date, 1)
    ) {
      const dailyPrice = range.price;
      const discount = getDiscountForDate(date, discountRanges);
      const discountedPrice = dailyPrice * (1 - discount / 100);
      totalPrice += discountedPrice;
    }
  });

  return Math.floor(totalPrice);
};

export const isValidChangeoverDay = (date, changeoverDay) => {
  const dayOfWeek = format(date, "EEEE"); // Get day of the week (e.g., "Saturday")
  return changeoverDay === "Flexible" || dayOfWeek === changeoverDay;
};

export const filterByChangeoverDayAndMinimumStay = (
  priceRanges,
  fromDate,
  toDate
) => {
  let startRangeValid = false;
  let endRangeValid = false;

  const totalStay = differenceInCalendarDays(toDate, fromDate);

  priceRanges.forEach((range) => {
    // Calculate the overlap between the price range and the user's date range
    const overlapStart = max([
      parse(range.date_start, "yyyy-MM-dd", new Date()),
      fromDate,
    ]);
    const overlapEnd = min([
      parse(range.date_end, "yyyy-MM-dd", new Date()),
      toDate,
    ]);

    // Ensure there is a valid overlap
    if (isBefore(overlapEnd, overlapStart)) return false;

    // Check if the changeover day conditions are met
    if (
      isSameDay(overlapStart, fromDate) &&
      isValidChangeoverDay(fromDate, range.changeover_day)
    ) {
      startRangeValid = true;
    }

    if (
      isSameDay(overlapEnd, toDate) &&
      isValidChangeoverDay(toDate, range.changeover_day)
    ) {
      endRangeValid = true;
    }

    // Apply minimum stay only if the changeover day is "Flexible"
    if (range.changeoverDay === "Flexible" && totalStay < range.minimum_stay) {
      startRangeValid = false;
      endRangeValid = false;
    }
  });

  return startRangeValid && endRangeValid;
};
