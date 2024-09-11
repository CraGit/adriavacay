/**
 * @typedef {import("@prismicio/client").Content.SelectedDestinationsSlice} SelectedDestinationsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SelectedDestinationsSlice>} SelectedDestinationsProps
 * @param {SelectedDestinationsProps}
 */
import BlogList from "@/components/BlogList";
import SmallHeading from "@/components/SmallHeading";
import { createClient } from "@/prismicio";
const SelectedDestinations = async ({ slice }) => {
  // console.log(slice.primary.selected_destinations);

  const destinationsUids = slice.primary.selected_destinations.map(
    (destination) => {
      return destination.destination.uid;
    }
  );
  const client = createClient();
  const blogs = await client.getAllByUIDs("destination", destinationsUids);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="text-center ">
        <SmallHeading heading={slice.primary.heading} />
      </div>
      <BlogList blogs={blogs} />
    </section>
  );
};

export default SelectedDestinations;
