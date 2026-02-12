import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { routing } from "@/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  const client = createClient();
  const page = await client.getSingle("destinations", { lang: locale });

  return (
    <>
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("destinations", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("destinations", {
    lang: "*",
    fetchOptions: { cache: "no-store" },
  });

  return pages.map((page) => {
    const locale = page.lang && page.lang.startsWith("en") ? "en-us" : page.lang && page.lang.startsWith("de") ? "de" : page.lang;
    return { uid: page.uid, locale };
  });
}
