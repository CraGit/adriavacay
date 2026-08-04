import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";
import SmallHero from "@/components/SmallHero";

import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/lib/richText";
import PhotoGallery from "@/components/Gallery";
import { setRequestLocale } from "next-intl/server";
import { getImageAlt } from "@/lib/image-alt";

export default async function Page({ params }) {
  const { locale, uid } = await params;
  setRequestLocale(locale);

  const client = createClient();
  const page = await client
    .getByUID("blog_single", uid, { lang: locale })
    .catch(() => notFound());

  const photos = (page.data.gallery || []).map((photo) => {
    return {
      src: photo.image.url,
      alt: getImageAlt(photo.image, page.data.heading),
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
      description: getImageAlt(photo.image, page.data.heading),
    };
  });

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
        {photos && photos.length > 0 && (
          <div className="max-w-5xl mx-auto pb-16">
            <PhotoGallery photos={photos} heading="Gallery" />
          </div>
        )}
      </div>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { locale, uid } = await params;
  const client = createClient();
  const page = await client
    .getByUID("blog_single", uid, { lang: locale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_single", {
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
