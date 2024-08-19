/**
 * @typedef {import("@prismicio/client").Content.DestinationListSliceSlice} DestinationListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<DestinationListSliceSlice>} DestinationListSliceProps
 * @param {DestinationListSliceProps}
 */
import BlogList from "@/app/components/BlogList";
import SectionHeading from "@/app/components/SectionHeading";
import { createClient } from "@/prismicio";
const DestinationListSlice = async ({ slice }) => {
  const client = createClient();

  const blogs = await client.getAllByType("destination");
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative lg:py-16 py-8"
    >
      <BlogList blogs={blogs} />
    </section>
  );
};

export default DestinationListSlice;
