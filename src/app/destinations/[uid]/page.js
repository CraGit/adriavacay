import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";

import SmallHero from "@/components/SmallHero";

import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/lib/richText";

export default async function Page({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("destination", params.uid)
    .catch(() => notFound());

  return (
    <>
      <SmallHero
        heading={page.data.heading}
        backgroundImage={page.data.image}
      />
      <div className="container">
        {" "}
        <PrismicRichText field={page.data.content} components={rtfComponents} />
      </div>
      {/* {page.data.gallery.length > 0 &&  */}

      {/* <PhotoGallery images={page.data.gallery} heading="Gallery" /> */}
      {/* } */}
    </>
  );
}

export async function generateMetadata({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("destination", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("destination");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
