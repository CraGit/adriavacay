import { createClient } from "@/prismicio";
import SmallHero from "@/app/components/SmallHero";
import rtfComponents from "@/app/utilities/richText";
import { PrismicRichText } from "@prismicio/react";
export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("terms_and_conditions");

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

export async function generateMetadata() {
  const client = createClient();
  const page = await client.getSingle("terms_and_conditions");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
