import { subscribeNewsletter } from "@/actions/subscribeNewsletter";

/**
 * @typedef {import("@prismicio/client").Content.NewsletterSliceSlice} NewsletterSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<NewsletterSliceSlice>} NewsletterSliceProps
 * @param {NewsletterSliceProps}
 */
const NewsletterSlice = ({ slice }) => {
  const { heading, subheading } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative py-16 bg-slate-50 dark:bg-slate-800"
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-slate-500 dark:text-slate-400 mb-8">{subheading}</p>
          )}

          <form action={subscribeNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email address"
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSlice;
