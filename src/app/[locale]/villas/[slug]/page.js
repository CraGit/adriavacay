import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/prismicio";
import { AccommodationSingle } from "@/app/[locale]/accommodation/accommodation-single";
import { withMyRentCalendar } from "@/lib/accommodation-myrent";
import { isDynamicServerUsage } from "@/lib/myrent";
import { filterAccommodationsWithValidPricing } from "@/lib/validation";
import { getImageAlt } from "@/lib/image-alt";

// ---------------------------------------------------------------------------
// Slug → filter configuration
// ---------------------------------------------------------------------------
const VILLA_PAGES = {
  "villas-in-split": {
    title: "Villas in Split",
    titleDe: "Villen in Split",
    filter: (v) => v.data.location === "Split Area",
  },
  "villas-in-omis": {
    title: "Villas in Omiš",
    titleDe: "Villen in Omiš",
    filter: (v) => v.data.location === "Omis Area",
  },
  "villas-in-makarska": {
    title: "Villas in Makarska",
    titleDe: "Villen in Makarska",
    filter: (v) => v.data.location === "Makarska Area",
  },
  "villas-in-dubrovnik": {
    title: "Villas in Dubrovnik",
    titleDe: "Villen in Dubrovnik",
    filter: (v) => v.data.location === "Dubrovnik Area",
  },
  "villas-in-sibenik": {
    title: "Villas in Šibenik",
    titleDe: "Villen in Šibenik",
    filter: (v) => v.data.location === "Šibenik Area",
  },
  "villas-with-heated-pool": {
    title: "Villas with Heated Pool",
    titleDe: "Villen mit beheiztem Pool",
    filter: (v) => v.data.features?.some((f) => f.heatedPool),
  },
  "villas-with-jacuzzi": {
    title: "Villas with Jacuzzi",
    titleDe: "Villen mit Jacuzzi",
    filter: (v) => v.data.features?.some((f) => f.jacuzzi),
  },
  "villas-with-sauna": {
    title: "Villas with Sauna",
    titleDe: "Villen mit Sauna",
    filter: (v) => v.data.features?.some((f) => f.sauna),
  },
  "villas-with-sea-view": {
    title: "Villas with Sea View",
    titleDe: "Villen mit Meerblick",
    filter: (v) => v.data.features?.some((f) => f.seaView),
  },
  "villas-on-the-beach": {
    title: "Villas on the Beach",
    titleDe: "Villen am Strand",
    filter: (v) => v.data.features?.some((f) => f.beach),
  },
  "villas-with-playground": {
    title: "Villas with Playground",
    titleDe: "Villen mit Spielplatz",
    filter: (v) => v.data.features?.some((f) => f.playground),
  },
  "villas-with-garden": {
    title: "Villas with Garden",
    titleDe: "Villen mit Garten",
    filter: (v) => v.data.features?.some((f) => f.garden),
  },
  "villas-with-pet-friendly": {
    title: "Pet Friendly Villas",
    titleDe: "Villen haustierfreundlich",
    filter: (v) => v.data.features?.some((f) => f.petFriendly),
  },
};

// Slug → settings field name for hero image
const SLUG_TO_HERO_FIELD = {
  "villas-in-split": "hero_villas_in_split",
  "villas-in-omis": "hero_villas_in_omis",
  "villas-in-makarska": "hero_villas_in_makarska",
  "villas-in-dubrovnik": "hero_villas_in_dubrovnik",
  "villas-in-sibenik": "hero_villas_in_sibenik",
  "villas-with-heated-pool": "hero_heated_pool",
  "villas-with-jacuzzi": "hero_jacuzzi",
  "villas-with-sauna": "hero_sauna",
  "villas-with-sea-view": "hero_sea_view",
  "villas-on-the-beach": "hero_beach",
  "villas-with-playground": "hero_playground",
  "villas-with-garden": "hero_garden",
  "villas-with-pet-friendly": "hero_pet_friendly",
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const client = createClient();
  const villas = await client.getAllByType("accommodation_single", {
    lang: "*",
    fetchOptions: { cache: "no-store" },
  });

  // Only generate paths for locales that have at least one villa
  const locales = [...new Set(villas.map((v) => v.lang))].map((lang) =>
    lang.startsWith("en") ? "en-us" : lang.startsWith("de") ? "de" : lang
  );

  return Object.keys(VILLA_PAGES).flatMap((slug) =>
    locales.map((locale) => ({ slug, locale }))
  );
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const config = VILLA_PAGES[slug];
  if (!config) return {};
  const title = locale === "de" ? config.titleDe : config.title;
  return {
    title: `${title} | Adria Vacay`,
    description: `Browse our selection of ${title.toLowerCase()} in Croatia.`,
  };
}

export default async function VillaFilterPage({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const config = VILLA_PAGES[slug];
  if (!config) notFound();

  const client = createClient();
  const allVillas = await client.getAllByType("accommodation_single", {
    lang: locale,
    fetchOptions: { cache: "no-store" },
  });

  const filtered = allVillas
    .filter((v) => v.data.type === "Villa")
    .filter(config.filter);

  // Enrich each villa with iCal calendar data and pricing — same logic as AccommodationListSlice
  const enriched = await Promise.all(
    filtered.map(async (villa) => {
      try {
        if (locale === "de") {
          const alternates = Array.isArray(villa.alternate_languages)
            ? villa.alternate_languages
            : [];
          const englishAlt =
            alternates.find((alt) => alt.lang?.startsWith("en")) ||
            alternates[0] ||
            null;

          let enData = null;
          if (englishAlt?.id) {
            try {
              enData = await client.getByID(englishAlt.id);
            } catch (e) {
              console.warn(
                "Failed to fetch alternate language for villa",
                englishAlt,
                e
              );
            }
          }

          if (enData?.data) {
            return withMyRentCalendar(villa, {
              pricing: enData.data.pricing || [],
              discounts: enData.data.discounts || [],
              myRentId: enData.data.myRentID,
              icalUrl: enData.data.ical,
            });
          }

          return withMyRentCalendar(villa, {
            pricing: villa.data?.pricing || [],
            discounts: villa.data?.discounts || [],
            myRentId: villa.data?.myRentID,
            icalUrl: villa.data?.ical,
          });
        }

        return withMyRentCalendar(villa, {
          pricing: villa.data.pricing || [],
          discounts: villa.data.discounts || [],
          myRentId: villa.data.myRentID,
          icalUrl: villa.data.ical,
        });
      } catch (err) {
        if (!isDynamicServerUsage(err)) {
          console.error("Error enriching villa", villa.uid, err);
        }
        return null;
      }
    })
  );

  const villas = filterAccommodationsWithValidPricing(
    enriched.filter(Boolean)
  );

  const heading = locale === "de" ? config.titleDe : config.title;

  // Fetch hero image from settings
  const settings = await client
    .getSingle("settings", { lang: locale })
    .catch(() => null);
  const heroField = SLUG_TO_HERO_FIELD[slug];
  const heroImage = settings?.data?.[heroField];

  return (
    <>
      {/* Page header */}
      <section className="relative table w-full py-32 lg:py-36 bg-slate-800">
        <div className="absolute inset-0">
          {heroImage?.url && (
            <Image
              fill
              src={heroImage.url}
              alt={getImageAlt(heroImage, heading)}
              style={{ objectFit: "cover" }}
              sizes="100vw"
              quality={75}
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container relative">
          <div className="grid grid-cols-1 text-center mt-10">
            <h1 className="md:text-4xl text-3xl md:leading-normal leading-normal font-medium text-white">
              {heading}
            </h1>
          </div>
        </div>
      </section>

      {/* Villa grid */}
      <section className="relative lg:py-16 py-8">
        <div className="container">
          {villas.length === 0 ? (
            <p className="text-center text-slate-400 py-16">
              {locale === "de"
                ? "Keine Villen gefunden."
                : "No villas found."}
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
              <AccommodationSingle accommodations={villas} showAll={false} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
