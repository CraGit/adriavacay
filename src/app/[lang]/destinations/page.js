import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params: { lang } }) {
  const client = createClient();
  const page = await client.getSingle("destinations", { lang });

  return (
    <>
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({ params: { lang } }) {
  const client = createClient();
  const page = await client.getSingle("destinations", { lang });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
