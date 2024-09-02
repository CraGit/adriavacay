import BlogList from "@/components/BlogList";
import { createClient } from "@/prismicio";

/**
 * @typedef {import("@prismicio/client").Content.DestinationListSliceSlice} DestinationListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<DestinationListSliceSlice>} DestinationListSliceProps
 * @param {DestinationListSliceProps}
 */
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
