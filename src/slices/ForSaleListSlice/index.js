/**
 * @typedef {import("@prismicio/client").Content.ForSaleListSliceSlice} ForSaleListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ForSaleListSliceSlice>} ForSaleListSliceProps
 * @param {ForSaleListSliceProps}
 */

import { getLocale, getTranslations } from "next-intl/server";

import SectionHeading from "@/components/SectionHeading";
import { Link } from "@/i18n/routing";
import { createClient } from "@/prismicio";
import { ForSaleSingle } from "@/app/[locale]/for-sale/for-sale-single";

const ForSaleListSlice = async ({ slice }) => {
  const client = createClient();
  const locale = await getLocale();
  const villas = await client.getAllByType("for_sale_single", {
    lang: locale,
    fetchOptions: { cache: "no-store" },
  });

  const t = await getTranslations("for-sale-list");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative lg:py-16 py-8"
    >
      {slice.primary.limit === "No limit"}
      <SectionHeading
        heading={slice.primary.heading}
        subheading={slice.primary.description}
      />
      <section className="relative lg:py-16 py-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
            <ForSaleSingle villas={villas} />
          </div>
        </div>
      </section>
    </section>
  );
};

export default ForSaleListSlice;
