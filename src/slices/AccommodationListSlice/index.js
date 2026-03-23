import { getLocale, getTranslations } from "next-intl/server";

import { AccommodationSingle } from "@/app/[locale]/accommodation/accommodation-single";
import Filter from "@/components/Filter";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "@/i18n/routing";
import { fetchMyRentDays } from "@/lib/myrent";
import { myRentOccupiedDates } from "@/lib/myrent-utils";
import { occupiedDatesFromIcal } from "@/lib/utils";
import {
  filterAccommodationsWithValidPricing,
  cleanAccommodationPricingData,
} from "@/lib/validation";
import { createClient } from "@/prismicio";

/**
 * @typedef {import("@prismicio/client").Content.AccommodationListSliceSlice} AccommodationListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AccommodationListSliceSlice>} AccommodationListSliceProps
 * @param {AccommodationListSliceProps}
 */
const AccommodationListSlice = async ({ slice }) => {
  const client = createClient();
  const locale = await getLocale();

  const accommodations = await client.getAllByType("accommodation_single", {
    lang: locale,
    fetchOptions: { cache: "no-store" },
  });

  const accommodationsWithCalendar = await Promise.all(
    accommodations.map(async (a) => {
      try {
        if (locale === "de") {
          const alternates = Array.isArray(a.alternate_languages)
            ? a.alternate_languages
            : [];
          const englishAlt = alternates.find((alt) => alt.lang && alt.lang.startsWith("en")) || alternates[0] || null;

          let enData = null;
          if (englishAlt && englishAlt.id) {
            try {
              enData = await client.getByID(englishAlt.id);
            } catch (e) {
              // failed to fetch english alt, leave enData null
              console.warn("Failed to fetch alternate language for accommodation", englishAlt, e);
            }
          }

          if (enData && enData.data) {
            const myRentId = enData.data.myRentID;
            if (myRentId) {
              const myRentDays = await fetchMyRentDays(myRentId);
              return {
                ...a,
                pricing: enData.data.pricing || [],
                discounts: enData.data.discounts || [],
                myRentDays,
                occupiedDates: myRentOccupiedDates(myRentDays),
                checkoutDates: [],
              };
            }

            const occupiedData = await occupiedDatesFromIcal(enData.data.ical);

            const accommodation = {
              ...a,
              pricing: enData.data.pricing,
              discounts: enData.data.discounts,
              occupiedDates: occupiedData.occupiedDates,
              checkoutDates: occupiedData.checkoutDates,
            };

            // Clean pricing data and validate
            return cleanAccommodationPricingData(accommodation);
          }

          // Fallback: try to use the current document's data if english alternate isn't available
          const myRentIdFallback = a.data?.myRentID;
          if (myRentIdFallback) {
            const myRentDays = await fetchMyRentDays(myRentIdFallback);
            return {
              ...a,
              pricing: a.data?.pricing || [],
              discounts: a.data?.discounts || [],
              myRentDays,
              occupiedDates: myRentOccupiedDates(myRentDays),
              checkoutDates: [],
            };
          }

          const occupiedDataFallback = await occupiedDatesFromIcal(a.data?.ical || "");
          const accommodationFallback = {
            ...a,
            pricing: a.data?.pricing,
            discounts: a.data?.discounts,
            occupiedDates: occupiedDataFallback.occupiedDates,
            checkoutDates: occupiedDataFallback.checkoutDates,
          };

          return cleanAccommodationPricingData(accommodationFallback);
        } else {
          const myRentId = a.data.myRentID;
          if (myRentId) {
            const myRentDays = await fetchMyRentDays(myRentId);
            return {
              ...a,
              pricing: a.data.pricing || [],
              discounts: a.data.discounts || [],
              myRentDays,
              occupiedDates: myRentOccupiedDates(myRentDays),
              checkoutDates: [],
            };
          }

          const occupiedData = await occupiedDatesFromIcal(a.data.ical);

          const accommodation = {
            ...a,
            pricing: a.data.pricing,
            discounts: a.data.discounts,
            occupiedDates: occupiedData.occupiedDates,
            checkoutDates: occupiedData.checkoutDates,
          };

          // Clean pricing data and validate
          return cleanAccommodationPricingData(accommodation);
        }
      } catch (err) {
        console.error("Error processing accommodation", a, err);
        return null;
      }
    })
  );

  // Filter out accommodations with insufficient pricing data
  const validAccommodations = filterAccommodationsWithValidPricing(
    accommodationsWithCalendar.filter(Boolean)
  );

  /*const accommodationsEn = await client.getAllByType("accommodation_single", {
    lang: "en-us",
  });

  const pricingAndAvailabilityMap = new Map();
  accommodationsEn.forEach((a) => {
    pricingAndAvailabilityMap.set(a.uid, a.data);
  });

  const accommodationsWithCalendar = await Promise.all(
    accommodations.map(async (a) => {
      const enData = pricingAndAvailabilityMap.get(a.uid);
      return {
        ...a,

        pricing: enData?.pricing,
        discounts: enData?.discounts,
        //availability: enData?.availability,

        occupiedDates: await occupiedDatesFromIcal(enData?.ical),
      };
    })
  );*/

  const sortedAccommodations = validAccommodations.sort((a, b) => {
    if (a.data.isFeatured && !b.data.isFeatured) {
      return -1;
    } else if (!a.data.isFeatured && b.data.isFeatured) {
      return 1;
    } else {
      return 0;
    }
  });

  const t = await getTranslations("accommodation-list");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative lg:py-16 py-8"
    >
      {slice.primary.limit === "No limit" && <Filter />}
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
              {t("show-all")}
            </Link>
          </li>
        </div>
      ) : null}
    </section>
  );
};

export default AccommodationListSlice;
