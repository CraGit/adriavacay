import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);

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

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("accommodation", { lang: "*" });

  return pages.map((page) => ({ uid: page.uid, locale: page.lang }));
}
