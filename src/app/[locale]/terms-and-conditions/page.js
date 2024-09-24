import { PrismicRichText } from "@prismicio/react";

import SmallHero from "@/components/SmallHero";
import rtfComponents from "@/lib/richText";
import { createClient } from "@/prismicio";
import { routing } from "@/i18n/routing";

export default async function Page({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("terms_and_conditions", { lang: locale });

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
    </>
  );
}

export async function generateMetadata({ params: { locale } }) {
  const client = createClient();
  const page = await client.getSingle("terms_and_conditions", { lang: locale });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("terms_and_conditions", {
    lang: "*",
  });

  return pages.map((page) => ({ uid: page.uid, lang: page.lang }));
}
