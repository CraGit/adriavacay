"use client";

import Card from "@/components/Card";
import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
  filterByChangeoverDayAndMinimumStay,
  hasOverlap,
} from "@/lib/utils";
import {
  myRentCalculatePrice,
  myRentIsEndDateValid,
} from "@/lib/myrent-utils";
import { filterAccommodationsWithValidPricing } from "@/lib/validation";
import { useSearch } from "@/providers/search-provider";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export const AccommodationSingle = ({ accommodations, showAll }) => {
  const [type, setType] = useQueryState("type", {
    defaultValue: "All",
  });
  const { query, updateQuery } = useSearch();

  useEffect(() => {
    query.type !== type && query.type !== "All" && setType(query.type);
  }, []);

  // If showAll flag is explicitly set, show all accommodations
  if (showAll) {
    return renderAllAccommodations(accommodations, type);
  }

  // Initialize with all accommodations filtered by type and valid pricing
  let filtered = accommodations.filter((item) =>
    type === "All" ? true : item.data.type === type
  );

  // Filter out accommodations with invalid pricing data
  filtered = filterAccommodationsWithValidPricing(filtered);

  // Apply optional guest filter if provided
  if (query && query.guests) {
    filtered = filtered.filter((item) => item.data.max_guests >= query.guests);
  }

  // Apply optional date filter if both from and to dates are provided
  if (
    query &&
    query.dateRange &&
    query.dateRange.from !== null &&
    query.dateRange.to !== null
  ) {
    const beforeOverlapFilter = filtered.length;
    filtered = filtered.filter((item) => {
      const hasOverlapResult = hasOverlap(query.dateRange, item.occupiedDates);
      return !hasOverlapResult;
    });

    // Apply changeover day filter only if dates are provided
    const beforeChangeoverFilter = filtered.length;
    filtered = filtered.filter((item) => {
      if (item.myRentDays) {
        return myRentIsEndDateValid(
          query.dateRange.from,
          query.dateRange.to,
          item.myRentDays
        );
      }
      const changeoverResult = filterByChangeoverDayAndMinimumStay(
        item.pricing,
        query.dateRange.from,
        query.dateRange.to
      );
      return changeoverResult;
    });

    // If we have dates, render with calculated prices
    return renderWithCalculatedPrices(filtered, query.dateRange);
  }

  // If no dates provided, render with lowest prices
  return renderAllAccommodations(filtered, type);
};

// Helper function to render accommodations with calculated prices based on date range
const renderWithCalculatedPrices = (accommodations, dateRange) => {
  if (accommodations.length === 0) {
    return <p>No results found</p>;
  }

  return accommodations.map((item) => {
    const price = item.myRentDays
      ? myRentCalculatePrice(item.myRentDays, dateRange.from, dateRange.to)
      : calculateTotalPrice(
          item.pricing,
          dateRange.from,
          dateRange.to
        );

    const discountedPrice = item.myRentDays
      ? price
      : calculateTotalPriceWithDiscount(
          item.pricing,
          item.discounts,
          dateRange.from,
          dateRange.to
        );

    return price && price !== 0 ? (
      <Card
        key={item.id}
        uid={item.uid}
        baths={item.data.bathrooms}
        bedrooms={item.data.bedrooms}
        basePrice={price}
        discountedPrice={discountedPrice}
        image={item.data.gallery[0].image.url}
        alt={item.data.gallery[0].image}
        sqm={item.data.sqm}
        title={item.data.heading}
        guests={item.data.max_guests}
        guestsPrikaz={item.data.guestsPrikaz}
        type={item.data.type}
        features={item.data.features}
      />
    ) : null;
  });
};

// Helper function to render all accommodations with lowest price
const renderAllAccommodations = (accommodations, type) => {
  // Filter by type and valid pricing
  let filtered = accommodations.filter((item) =>
    type === "All" ? true : item.data.type === type
  );

  // Filter out accommodations with invalid pricing data
  filtered = filterAccommodationsWithValidPricing(filtered);

  return filtered
    .map((item) => {
      let lowestPrice;

      if (item.myRentDays) {
        const prices = Object.values(item.myRentDays)
          .filter((d) => d.available && d.price > 0)
          .map((d) => d.price);
        if (prices.length === 0) return null;
        lowestPrice = Math.floor(Math.min(...prices));
      } else {
        const validPrices = item.data.pricing.filter(
          (p) => p.price && p.price > 0
        );
        if (validPrices.length === 0) return null;
        lowestPrice = Math.floor(
          Math.min(...validPrices.map((p) => p.price))
        );
      }

      return (
        <Card
          key={item.id}
          uid={item.uid}
          baths={item.data.bathrooms}
          bedrooms={item.data.bedrooms}
          lowestPrice={lowestPrice}
          image={item.data.gallery[0].image.url}
          alt={item.data.gallery[0].image}
          sqm={item.data.sqm}
          title={item.data.heading}
          guests={item.data.max_guests}
          guestsPrikaz={item.data.guestsPrikaz}
          type={item.data.type}
          features={item.data.features}
        />
      );
    })
    .filter(Boolean); // Remove null entries
};
