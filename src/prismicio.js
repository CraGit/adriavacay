import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import config from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 *
 * @type {prismic.ClientConfig["routes"]}
 */
// TODO: Update the routes array to match your project's route structure.
const routes = [
  {
    type: "homepage",
    path: "/:lang?",
  },
  {
    type: "accommodation",
    path: "/:lang?/accommodation",
  },
  {
    type: "accommodation_single",
    path: "/:lang?/accommodation/:uid",
  },
  {
    type: "for_sale",
    path: "/:lang?/for-sale",
  },
  {
    type: "for_sale_single",
    path: "/:lang?/for-sale/:uid",
  },
  {
    type: "about_us",
    path: "/:lang?/about-us",
  },

  {
    type: "destinations",
    path: "/:lang?/destinations",
  },
  {
    type: "destination",
    path: "/:lang?/destinations/:uid",
  },
  {
    type: "blog",
    path: "/:lang?/blog",
  },
  {
    type: "blog_single",
    path: "/:lang?/blog/:uid",
  },
  {
    type: "contact",
    path: "/:lang?/contact",
  },
  {
    type: "terms_and_conditions",
    path: "/:lang?/terms-and-conditions",
  },
  {
    type: "privacy_policy",
    path: "/:lang?/privacy-policy",
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param {prismicNext.CreateClientConfig} config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    // In production: long-lived force-cache tagged for on-demand revalidation.
    // In dev: no default fetchOptions — callers set their own (e.g. no-store in
    // generateStaticParams) without triggering the cache/revalidate conflict.
    ...(process.env.NODE_ENV === "production" && {
      fetchOptions: { next: { tags: ["prismic"] }, cache: "force-cache" },
    }),
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
