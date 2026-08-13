import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const client = createClient();
  const page = await client
    .getSingle("apartments", { lang: locale })
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const client = createClient();
  const page = await client
    .getSingle("apartments", { lang: locale })
    .catch(() => ({}));

  return {
    title: page?.data?.meta_title,
    description: page?.data?.meta_description,
  };
}
