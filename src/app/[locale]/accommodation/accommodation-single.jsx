"use client";

import Card from "@/components/Card";
import {
  calculateTotalPrice,
  calculateTotalPriceWithDiscount,
  filterByChangeoverDayAndMinimumStay,
  hasOverlap,
} from "@/lib/utils";
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

  // Initialize with all accommodations filtered by type
  let filtered = accommodations.filter((item) =>
    type === "All" ? true : item.data.type === type
  );

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
    filtered = filtered.filter(
      (item) => !hasOverlap(query.dateRange, item.occupiedDates)
    );

    // Apply changeover day filter only if dates are provided
    filtered = filtered.filter((item) =>
      filterByChangeoverDayAndMinimumStay(
        item.pricing,
        query.dateRange.from,
        query.dateRange.to
      )
    );

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
    const price = calculateTotalPrice(
      item.pricing,
      dateRange.from,
      dateRange.to
    );

    const discountedPrice = calculateTotalPriceWithDiscount(
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
        alt={item.data.gallery[0].image.alt}
        sqm={item.data.sqm}
        title={item.data.heading}
        guests={item.data.max_guests}
        guestsPrikaz={item.data.guestsPrikaz}
        type={item.data.type}
      />
    ) : null;
  });
};

// Helper function to render all accommodations with lowest price
const renderAllAccommodations = (accommodations, type) => {
  return accommodations.map((item) => {
    const lowestPrice = Math.floor(
      Math.min(...item.data.pricing.map((p) => p.price))
    );

    return (
      <Card
        key={item.id}
        uid={item.uid}
        baths={item.data.bathrooms}
        bedrooms={item.data.bedrooms}
        lowestPrice={lowestPrice}
        image={item.data.gallery[0].image.url}
        alt={item.data.gallery[0].image.alt}
        sqm={item.data.sqm}
        title={item.data.heading}
        guests={item.data.max_guests}
        guestsPrikaz={item.data.guestsPrikaz}
        type={item.data.type}
      />
    );
  });
};
