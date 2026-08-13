import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { locale } = await params;
  const client = createClient();
  const page = await client.getSingle("homepage", { lang: locale });

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const client = createClient();
  const page = await client.getSingle("homepage", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
