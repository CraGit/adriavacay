"use client";

import { useSearch } from "@/providers/search-provider";
import Card from "../components/Card";
import { hasOverlap } from "@/lib/utils";

export const AccommodationSingle = ({ accommodations, showAll }) => {
  const { query } = useSearch();

  if (!showAll) {
    const filteredByGuests = accommodations.filter(
      (item) => item.data.max_guests >= query.guests
    );

    const filteredByDate = filteredByGuests.filter(
      (item) => !hasOverlap(query.dateRange, item.occupiedDates)
    );

    if (filteredByDate.length === 0) {
      return <p>No results found</p>;
    }

    return filteredByDate.map((item) => {
      return (
        <Card
          key={item.id}
          uid={item.uid}
          baths={item.data.bathrooms}
          bedrooms={item.data.bedrooms}
          lowestPrice="300"
          image={item.data.gallery[0].image.url}
          alt={item.data.gallery[0].image.alt}
          sqm={item.data.sqm}
          title={item.data.heading}
          guests={item.data.max_guests}
        />
      );
    });
  } else {
    return accommodations.map((item) => {
      return (
        <Card
          key={item.id}
          uid={item.uid}
          baths={item.data.bathrooms}
          bedrooms={item.data.bedrooms}
          lowestPrice="300"
          image={item.data.gallery[0].image.url}
          alt={item.data.gallery[0].image.alt}
          sqm={item.data.sqm}
          title={item.data.heading}
          guests={item.data.max_guests}
        />
      );
    });
  }
};
