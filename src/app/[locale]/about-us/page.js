import { PrismicRichText, SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import SmallHero from "@/components/SmallHero";
import rtfComponents from "@/lib/richText";
import PhotoGallery from "@/components/Gallery";

export default async function Page({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("about_us", { lang: locale });
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
      <div className="container mt-8">
        <PrismicRichText field={page.data.content} components={rtfComponents} />
        {photos && photos.length > 0 && (
          <PhotoGallery photos={photos} heading="Gallery" />
        )}
      </div>
    </>
  );
}

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("about_us", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
