/**
 * @typedef {import("@prismicio/client").Content.SelectedDestinationsSlice} SelectedDestinationsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SelectedDestinationsSlice>} SelectedDestinationsProps
 * @param {SelectedDestinationsProps}
 */
import BlogList from "@/components/BlogList";
import SmallHeading from "@/components/SmallHeading";
import { createClient } from "@/prismicio";

const SelectedDestinations = async ({ slice }) => {
  const destinationsUids = slice.primary.selected_destinations.map(
    (destination) => destination.destination.uid
  );

  const client = createClient();

  // Fetch both destinations and blog posts by UIDs
  const [destinations, blogs] = await Promise.all([
    client.getAllByUIDs("destination", destinationsUids),
    client.getAllByUIDs("blog_single", destinationsUids),
  ]);

  // Combine both destinations and blogs, if necessary
  const combinedResults = [...destinations, ...blogs];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="text-center">
        <SmallHeading heading={slice.primary.heading} />
      </div>
      <BlogList blogs={combinedResults} />
    </section>
  );
};

export default SelectedDestinations;
