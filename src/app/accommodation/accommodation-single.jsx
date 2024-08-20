"use client";

import { useSearch } from "@/providers/search-provider";
import Card from "../components/Card";
import { calculateTotalPrice, hasOverlap } from "@/lib/utils";
import {
  parse,
  isAfter,
  isEqual,
  isBefore,
  differenceInCalendarDays,
} from "date-fns";

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

    // Filter minimum stay i/ili changeover day
    /*const filteredByMinStay = filteredByDate.filter((item) => {
      const pricing = item.data.pricing.find((p) => {
        const dateStart = parse(p.date_start, "yyyy-MM-dd", new Date());
        const dateEnd = parse(p.date_end, "yyyy-MM-dd", new Date());

        return (
          (isAfter(query.dateRange.from, dateStart) ||
            isEqual(query.dateRange.from, dateStart)) &&
          (isBefore(query.dateRange.to, dateEnd) ||
            isEqual(query.dateRange.to, dateEnd))
        );
      });

      if (!pricing) {
        return false;
      }

      const stayDays = differenceInCalendarDays(
        query.dateRange.to,
        query.dateRange.from
      );

      console.log({ pricing, stayDays });

      const changeoverDay =
        pricing.changeover_day === "Saturday"
          ? 6
          : pricing.changeover_day === "Sunday"
            ? 0
            : undefined;

      return pricing.min_stay < stayDays;
    });*/

    return filteredByDate.map((item) => {
      const price = calculateTotalPrice(
        item.data.pricing,
        query.dateRange.from,
        query.dateRange.to
      );

      console.log(price);

      return price && price !== 0 ? (
        <Card
          key={item.id}
          uid={item.uid}
          baths={item.data.bathrooms}
          bedrooms={item.data.bedrooms}
          price={price}
          image={item.data.gallery[0].image.url}
          alt={item.data.gallery[0].image.alt}
          sqm={item.data.sqm}
          title={item.data.heading}
          guests={item.data.max_guests}
        />
      ) : null; // Ne prikazujemo smještaj ako nema cijene za odabrane datume
    });
  } else {
    return accommodations.map((item) => {
      const lowestPrice = Math.min(...item.data.pricing.map((p) => p.price));

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
        />
      );
    });
  }
};
