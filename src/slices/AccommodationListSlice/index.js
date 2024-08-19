/**
 * @typedef {import("@prismicio/client").Content.AccommodationListSliceSlice} AccommodationListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AccommodationListSliceSlice>} AccommodationListSliceProps
 * @param {AccommodationListSliceProps}
 */
import CardList from "@/app/components/CardList";
import SectionHeading from "@/app/components/SectionHeading";
import SmallHero from "@/app/components/SmallHero";
import { createClient } from "@/prismicio";
import Link from "next/link";
const AccommodationListSlice = async ({ slice }) => {
  const client = createClient();
  const accommodations = await client.getAllByType("accommodation_single");

  const sortedAccommodations = accommodations.sort((a, b) => {
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
      <CardList
        cardDetails={sortedAccommodations}
        limit={slice.primary.limit}
      />
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
