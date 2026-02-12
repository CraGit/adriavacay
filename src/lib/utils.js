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
  startOfDay,
} from "date-fns";
import { enGB } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import {
  filterValidPriceRanges,
  filterValidDiscountRanges,
  hasSufficientPricingData,
} from "./validation";

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
  const checkoutDates = []; // Track checkout dates separately

  try {
    if (!url) return { occupiedDates: dates, checkoutDates };

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return { occupiedDates: dates, checkoutDates };

    const text = await res.text();

    ical(text).forEach((e) => {
      const startDate = startOfDay(e.startDate);
      const endDate = startOfDay(e.endDate);

      // Add checkout date to separate array
      checkoutDates.push(endDate);

      // Fully occupied dates exclude checkout date
      const interval = eachDayOfInterval({
        start: startDate,
        end: subDays(endDate, 1),
      });

      dates.push(...interval);
    });
  } catch (error) {
    console.error("Error parsing iCal:", error);
    return { occupiedDates: dates, checkoutDates };
  }

  return {
    occupiedDates: dates,
    checkoutDates, // Return both arrays
  };
};

export const occupiedRangesFromIcal = async (url) => {
  const dates = [];

  try {
    if (!url) return dates;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return dates;

    const text = await res.text();

    ical(text).forEach((e) => {
      const startDate = e.startDate;
      const endDate = e.endDate;

      dates.push({ startDate, endDate });
    });
  } catch (error) {
    return dates;
  }

  return dates;
};

export const hasOverlap = (range, excludedDates) => {
  // Add safety check for excludedDates
  if (!excludedDates || !Array.isArray(excludedDates)) {
    return false;
  }

  return excludedDates.some((d) => {
    // Additional safety check for individual date objects
    if (!d || !(d instanceof Date)) {
      return false;
    }

    // Check if the excluded date falls within the stay period
    // Exclude the checkout date (end of range) to allow back-to-back bookings
    return isWithinInterval(d, {
      start: range.from,
      end: addDays(range.to, -1), // Exclude checkout date
    });
  });
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

const getPriceForDate = (date, priceRanges) => {
  const range = priceRanges.find(({ date_start, date_end }) =>
    isWithinInterval(date, {
      start: parse(date_start, "yyyy-MM-dd", new Date()),
      end: parse(date_end, "yyyy-MM-dd", new Date()),
    })
  );

  return range ? range.price : 0;
};

export const calculateTotalPrice = (priceRanges, fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;

  // Filter out invalid price ranges first
  const validPriceRanges = filterValidPriceRanges(priceRanges);
  if (!hasSufficientPricingData(validPriceRanges)) return 0;

  const days = eachDayOfInterval({ start: fromDate, end: addDays(toDate, -1) }); // skidamo jedan dan jer ne racunamo zadnji dan

  const totalPrice = days.reduce((total, date) => {
    return total + getPriceForDate(date, validPriceRanges);
  }, 0);

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
  if (!fromDate || !toDate) return 0;

  // Filter out invalid price and discount ranges first
  const validPriceRanges = filterValidPriceRanges(priceRanges);
  const validDiscountRanges = filterValidDiscountRanges(discountRanges);

  if (!hasSufficientPricingData(validPriceRanges)) return 0;

  let totalPrice = 0;
  let totalDiscount = 0;

  let currentDate = fromDate;

  while (currentDate < toDate) {
    // strogo manje jer ne racunamo zadnji dan
    const price = getPriceForDate(currentDate, validPriceRanges);
    const discount = getDiscountForDate(currentDate, validDiscountRanges);

    if (price !== null && price > 0) {
      const discountAmount = (price * discount) / 100;
      totalPrice += price;
      totalDiscount += discountAmount;
    }

    currentDate = addDays(currentDate, 1);
  }

  return Math.floor(totalPrice - totalDiscount);
};

export const isDateInRange = (date, range) => {
  return isWithinInterval(date, {
    start: range.date_start,
    end: range.date_end,
  });
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
  if (!fromDate || !toDate) return false;

  // Filter out invalid price ranges first
  const validPriceRanges = filterValidPriceRanges(priceRanges);
  if (!hasSufficientPricingData(validPriceRanges)) return false;

  let startRangeValid = false;
  let endRangeValid = false;
  let minimumStayValid = false;

  const totalStay = differenceInCalendarDays(toDate, fromDate);

  for (const range of validPriceRanges) {
    // Parse dates once to avoid repeated parsing
    const rangeStart = parse(range.date_start, "yyyy-MM-dd", new Date());
    const rangeEnd = parse(range.date_end, "yyyy-MM-dd", new Date());

    // Calculate the overlap between the price range and the user's date range
    const overlapStart = max([rangeStart, fromDate]);
    const overlapEnd = min([rangeEnd, toDate]);

    // Skip if there is no valid overlap
    if (isBefore(overlapEnd, overlapStart)) continue;

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

    // Check minimum stay requirement for all changeover types
    if (totalStay >= (range.minimum_stay || 1)) {
      minimumStayValid = true;
    }
  }

  return startRangeValid && endRangeValid && minimumStayValid;
};
