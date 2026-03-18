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

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("about_us", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
