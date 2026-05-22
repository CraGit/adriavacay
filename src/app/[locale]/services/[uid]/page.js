import { notFound } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/prismicio";
import SmallHero from "@/components/SmallHero";
import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/lib/richText";
import PhotoGallery from "@/components/Gallery";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { Link } from "@/i18n/routing";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Page({ params }) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("services-single");

  const client = createClient();
  const page = await client
    .getByUID("service_single", params.uid, { lang: params.locale })
    .catch(() => notFound());

  const photos = page.data.gallery
    .filter((photo) => photo.image?.url)
    .map((photo) => ({
      src: photo.image.url,
      alt: photo.image.alt,
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
      description: photo.image.alt,
    }));

  return (
    <>
      <SmallHero
        heading={page.data.heading}
        backgroundImage={page.data.image}
      />

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

            {/* Sidebar */}
            <aside className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
              {/* Service image card */}
              {page.data.image?.url && (
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={page.data.image.url}
                    alt={page.data.image.alt || page.data.heading || ""}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              {/* Contact CTA card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {t("cta-title")}
                </h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  {t("cta-text")}
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full text-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors duration-300"
                  style={{ backgroundColor: "rgb(172 139 21)" }}
                >
                  {t("cta-button")}
                </Link>
              </div>
            </aside>

            {/* Main content */}
            <article className="lg:col-span-2 prose-custom">
              <PrismicRichText field={page.data.content} components={rtfComponents} />
            </article>

          </div>

          {/* Gallery */}
          {photos.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-100">
              <PhotoGallery photos={photos} heading="Gallery" />
            </div>
          )}
        </div>
      </section>

      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("service_single", params.uid, { lang: params.locale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("service_single", {
    lang: "*",
    fetchOptions: { cache: "no-store" },
  });

  return pages.map((page) => {
    const locale =
      page.lang && page.lang.startsWith("en")
        ? "en-us"
        : page.lang && page.lang.startsWith("de")
        ? "de"
        : page.lang;
    return { uid: page.uid, locale };
  });
}
