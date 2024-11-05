import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";

import SmallHero from "@/components/SmallHero";

import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/lib/richText";
import PhotoGallery from "@/components/Gallery";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Page({ params }) {
  unstable_setRequestLocale(params.locale);

  const client = createClient();
  const page = await client
    .getByUID("destination", params.uid, { lang: params.locale })
    .catch(() => notFound());

  const photos = page.data.gallery.map((photo) => {
    return {
      src: photo.image.url,
      alt: photo.image.alt,
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
      description: photo.image.alt,
    };
  });
  return (
    <>
      <SmallHero
        heading={page.data.heading}
        backgroundImage={page.data.image}
      />
      <div className="container">
        {" "}
        <PrismicRichText field={page.data.content} components={rtfComponents} />
        {photos && photos.length > 0 && (
          <PhotoGallery photos={photos} heading="Gallery" />
        )}
      </div>
      {/* {page.data.gallery.length > 0 &&  */}

      {/* } */}
    </>
  );
}

export async function generateMetadata({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("destination", params.uid, { lang: params.locale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams({ params }) {
  const client = createClient();
  const pages = await client.getAllByType("destination", {
    lang: "*",
  });

  return pages.map((page) => {
    return { uid: page.uid, locale: page.lang };
  });
}
