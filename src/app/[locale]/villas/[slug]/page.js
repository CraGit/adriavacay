import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createClient } from "@/prismicio";
import Card from "@/components/Card";

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
};

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

export async function generateMetadata({ params: { slug, locale } }) {
  const config = VILLA_PAGES[slug];
  if (!config) return {};
  const title = locale === "de" ? config.titleDe : config.title;
  return {
    title: `${title} | Adria Vacay`,
    description: `Browse our selection of ${title.toLowerCase()} in Croatia.`,
  };
}

export default async function VillaFilterPage({ params: { slug, locale } }) {
  unstable_setRequestLocale(locale);

  const config = VILLA_PAGES[slug];
  if (!config) notFound();

  const client = createClient();
  const allVillas = await client.getAllByType("accommodation_single", {
    lang: locale,
    fetchOptions: { cache: "no-store" },
  });

  const villas = allVillas
    .filter((v) => v.data.type === "Villa")
    .filter(config.filter);

  const heading = locale === "de" ? config.titleDe : config.title;

  return (
    <>
      {/* Page header */}
      <section className="relative table w-full py-32 lg:py-36 bg-slate-800">
        <div className="absolute inset-0 bg-black opacity-60" />
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
              {villas.map((villa) => (
                <Card
                  key={villa.id}
                  uid={villa.uid}
                  image={villa.data.gallery?.[0]?.image?.url}
                  alt={villa.data.gallery?.[0]?.image?.alt ?? ""}
                  title={villa.data.heading}
                  sqm={villa.data.sqm}
                  bedrooms={villa.data.bedrooms}
                  baths={villa.data.bathrooms}
                  guestsPrikaz={villa.data.guestsPrikaz}
                  type={villa.data.type}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
