import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";
import SmallHero from "@/components/SmallHero";
import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/lib/richText";
import PhotoGallery from "@/components/Gallery";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Page({ params }) {
  unstable_setRequestLocale(params.locale);

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
      <div className="container">
        <article className="max-w-3xl mx-auto py-12 md:py-16">
          <PrismicRichText field={page.data.content} components={rtfComponents} />
        </article>
        {photos.length > 0 && (
          <div className="max-w-5xl mx-auto pb-16">
            <PhotoGallery photos={photos} heading="Gallery" />
          </div>
        )}
      </div>
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
