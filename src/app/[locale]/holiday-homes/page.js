import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  const client = createClient();
  const page = await client
    .getSingle("holiday_homes", { lang: locale })
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client
    .getSingle("holiday_homes", { lang: locale })
    .catch(() => ({}));

  return {
    title: page?.data?.meta_title,
    description: page?.data?.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("holiday_homes", {
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
    return { locale };
  });
}
