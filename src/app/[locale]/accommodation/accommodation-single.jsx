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

  if (
    !showAll &&
    query &&
    query.guests &&
    query.dateRange.from !== null &&
    query.dateRange.to !== null
  ) {
    const filterByType = accommodations.filter((item) =>
      type === "All" ? true : item.data.type === type
    );

    const filteredByGuests = filterByType.filter(
      (item) => item.data.max_guests >= query.guests
    );

    const filteredByDate = filteredByGuests.filter(
      (item) => !hasOverlap(query.dateRange, item.occupiedDates)
    );

    if (filteredByDate.length === 0) {
      return <p>No results found</p>;
    }

    const filteredByChangeoverDay = filteredByDate.filter((item) =>
      filterByChangeoverDayAndMinimumStay(
        item.pricing,
        query.dateRange.from,
        query.dateRange.to
      )
    );

    if (filteredByChangeoverDay.length === 0) {
      return <p>No results found</p>;
    }

    return filteredByChangeoverDay.map((item) => {
      const price = calculateTotalPrice(
        item.pricing,
        query.dateRange.from,
        query.dateRange.to
      );

      const discountedPrice = calculateTotalPriceWithDiscount(
        item.pricing,
        item.discounts,
        query.dateRange.from,
        query.dateRange.to
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
      ) : null; // Ne prikazujemo ako nema cijene za datume
    });
  } else {
    return accommodations
      .filter((item) => (type === "All" ? true : item.data.type === type))
      .map((item) => {
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
  }
};
