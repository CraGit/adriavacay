import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params: { locale } }) {
  const client = createClient();
  const page = await client
    .getSingle("accommodation", { lang: locale })
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("accommodation", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
