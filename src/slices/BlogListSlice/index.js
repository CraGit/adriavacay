import BlogList from "@/components/BlogList";
import { createClient } from "@/prismicio";

/**
 * @typedef {import("@prismicio/client").Content.BlogListSliceSlice} BlogListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogListSliceSlice>} BlogListSliceProps
 * @param {BlogListSliceProps}
 */
const BlogListSlice = async ({ slice }) => {
  const client = createClient();

  const blogs = await client.getAllByType("blog_single");
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

export default BlogListSlice;
