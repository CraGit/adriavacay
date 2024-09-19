import Link from "next/link";

import { AccommodationSingle } from "@/app/[lang]/accommodation/accommodation-single";
import SectionHeading from "@/components/SectionHeading";
import { occupiedDatesFromIcal } from "@/lib/utils";
import { createClient } from "@/prismicio";

/**
 * @typedef {import("@prismicio/client").Content.AccommodationListSliceSlice} AccommodationListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AccommodationListSliceSlice>} AccommodationListSliceProps
 * @param {AccommodationListSliceProps}
 */
const AccommodationListSlice = async ({ slice }) => {
  const client = createClient();
  const accommodations = await client.getAllByType("accommodation_single");

  const accommodationsWithCalendar = await Promise.all(
    accommodations.map(async (a) => ({
      ...a,
      occupiedDates: await occupiedDatesFromIcal(a.data.ical),
    }))
  );

  const sortedAccommodations = accommodationsWithCalendar.sort((a, b) => {
    if (a.data.isFeatured && !b.data.isFeatured) {
      return -1;
    } else if (!a.data.isFeatured && b.data.isFeatured) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative lg:py-16 py-8"
    >
      <SectionHeading
        heading={slice.primary.heading}
        subheading={slice.primary.description}
      />
      <section className="relative lg:py-16 py-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
            <AccommodationSingle
              accommodations={sortedAccommodations.slice(
                0,
                slice.primary.limit !== "No limit"
                  ? parseInt(slice.primary.limit)
                  : undefined
              )}
              showAll={slice.primary.limit !== "No limit"}
            />
          </div>
        </div>
      </section>
      {slice.primary.limit !== "No limit" ? (
        <div className="text-center mt-8">
          <li className="sm:inline ps-1 mb-0 hidden">
            <Link
              href="/accommodation"
              className="btn bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-full"
            >
              Show All
            </Link>
          </li>
        </div>
      ) : null}
    </section>
  );
};

export default AccommodationListSlice;
