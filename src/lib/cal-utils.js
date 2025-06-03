import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";

export const isDateInOccupiedRanges = (date, occupiedRanges) => {
  return occupiedRanges.some(({ startDate, endDate }) =>
    isWithinInterval(date, {
      start: startDate,
      end: addDays(endDate, -1), // Adjust endDate by subtracting one day
    })
  );
};

// Check if a date is valid for check-in (checkout dates should be available for new check-ins)
export const isValidForCheckIn = (date, occupiedRanges) => {
  return !occupiedRanges.some(({ startDate, endDate }) =>
    isWithinInterval(date, {
      start: startDate,
      end: addDays(endDate, -1), // Exclude the checkout date - it should be available for new check-ins
    })
  );
};

// Check if a date is valid for checkout (can be same day as another check-in)
export const isValidForCheckOut = (date, occupiedRanges) => {
  return !occupiedRanges.some(({ startDate, endDate }) =>
    isWithinInterval(date, {
      start: addDays(startDate, 1), // Allow checkout on check-in dates of other bookings
      end: addDays(endDate, -1), // Exclude the checkout date itself
    })
  );
};

export const isChangeoverDayValid = (date, changeoverDay) => {
  const dayOfWeek = format(date, "EEEE");
  return changeoverDay === "Flexible" || dayOfWeek === changeoverDay;
};

export const getApplicablePriceRange = (date, priceRanges) => {
  /*return priceRanges.find(
    (range) =>
      isWithinInterval(date, {
        start: range.date_start,
        // end: addDays(range.date_end, -1),
        end: range.date_end,
      }) && range.price
  );*/
  return priceRanges.find((range, index, ranges) => {
    const previousRange = ranges[index - 1];

    const inCurrentRange = isWithinInterval(date, {
      start: range.date_start,
      end: range.date_end,
    });

    const isTransitionDay = previousRange
      ? isAfter(date, previousRange.date_end) &&
        isBefore(date, range.date_start)
      : false;

    return inCurrentRange || isTransitionDay;
  });
};

export const isDateAvailable = (date, priceRanges, unavailableRanges) => {
  const range = getApplicablePriceRange(date, priceRanges);
  if (!range || !range.price) return false;

  return (
    isValidForCheckIn(date, unavailableRanges) &&
    isChangeoverDayValid(date, range.changeover_day)
  );
};

export const isEndDateValid = (
  startDate,
  endDate,
  priceRanges,
  unavailableRanges
) => {
  const totalNights = differenceInCalendarDays(endDate, startDate);
  const range = getApplicablePriceRange(endDate, priceRanges);

  if (!range) return false;

  // Check if checkout date is valid
  if (!isValidForCheckOut(endDate, unavailableRanges)) {
    return false;
  }

  // Check all dates in the stay period (excluding checkout date)
  const stayDates = eachDayOfInterval({
    start: startDate,
    end: addDays(endDate, -1), // Exclude checkout date
  });

  return (
    isChangeoverDayValid(endDate, range.changeover_day) &&
    (!range.minimum_stay || totalNights >= range.minimum_stay) &&
    !stayDates.some((date) => isDateInOccupiedRanges(date, unavailableRanges))
  );
};

// Function to get available end dates based on the start date
export const getAvailableEndDates = (
  startDate,
  priceRanges,
  unavailableRanges
) => {
  const validEndDates = [];
  for (let days = 1; days <= 30; days++) {
    // Checking for next 30 days (adjust as necessary)
    const potentialEndDate = addDays(startDate, days);
    if (
      isEndDateValid(
        startDate,
        potentialEndDate,
        priceRanges,
        unavailableRanges
      )
    ) {
      validEndDates.push(potentialEndDate);
    }
  }
  return validEndDates;
};

export const hasValidEndDates = (startDate, priceRanges, unavailableRanges) => {
  const validEndDates = getAvailableEndDates(
    startDate,
    priceRanges,
    unavailableRanges
  );

  return validEndDates.length > 0;
};

// Function to determine if a date is an invalid selection day
export const isInvalidSelection = (
  date,
  selectedRange,
  priceRanges,
  unavailableRanges
) => {
  const { from, to } = selectedRange;

  if (!from || (from && to)) {
    return (
      !isDateAvailable(date, priceRanges, unavailableRanges) ||
      !hasValidEndDates(date, priceRanges, unavailableRanges)
    );
  }

  if (from && isAfter(date, from)) {
    return !isEndDateValid(from, date, priceRanges, unavailableRanges);
  }

  return false;
};
