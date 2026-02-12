import { createClient } from "@/prismicio";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://adriavacay.com";

export default async function sitemap() {
  const client = createClient();
  const locales = ["en-us", "de"];
  
  const sitemapEntries = [];

  // Static pages
  const staticPages = [
    { path: "", priority: 1, changeFrequency: "monthly" }, // Homepage
    { path: "/accommodation", priority: 0.9, changeFrequency: "weekly" },
    { path: "/for-sale", priority: 0.9, changeFrequency: "weekly" },
    { path: "/destinations", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" },
    { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" },
  ];

  // Add static pages with localization - create separate entries for each language
  for (const page of staticPages) {
    for (const locale of locales) {
      const localePath = locale === "en-us" ? page.path : `/${locale}${page.path}`;
      const languageAlternates = {};
      
      // Build alternates object for this entry
      for (const altLocale of locales) {
        const altPath = altLocale === "en-us" ? page.path : `/${altLocale}${page.path}`;
        languageAlternates[altLocale] = `${BASE_URL}${altPath}`;
      }
      
      sitemapEntries.push({
        url: `${BASE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: languageAlternates,
        },
      });
    }
  }

  // Fetch and add dynamic accommodation pages
  try {
    const accommodations = await client.getAllByType("accommodation_single", {
      lang: "*",
    });

    const accommodationsByUid = {};
    for (const doc of accommodations) {
      if (!accommodationsByUid[doc.uid]) {
        accommodationsByUid[doc.uid] = {};
      }
      accommodationsByUid[doc.uid][doc.lang] = doc;
    }

    for (const [uid, docs] of Object.entries(accommodationsByUid)) {
      const defaultDoc = Object.values(docs).find(d => d.lang && d.lang.startsWith("en")) || Object.values(docs)[0];
      
      // Create separate entries for each language
      for (const locale of locales) {
        const localePath = locale === "en-us" ? `/accommodation/${uid}` : `/${locale}/accommodation/${uid}`;
        const languageAlternates = {};
        
        for (const altLocale of locales) {
          const altPath = altLocale === "en-us" ? `/accommodation/${uid}` : `/${altLocale}/accommodation/${uid}`;
          languageAlternates[altLocale] = `${BASE_URL}${altPath}`;
        }
        
        sitemapEntries.push({
          url: `${BASE_URL}${localePath}`,
          lastModified: new Date(defaultDoc.last_publication_date),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: languageAlternates,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching accommodations:", error);
  }

  // Fetch and add dynamic for-sale pages
  try {
    const forSale = await client.getAllByType("for_sale_single", {
      lang: "*",
    });

    const forSaleByUid = {};
    for (const doc of forSale) {
      if (!forSaleByUid[doc.uid]) {
        forSaleByUid[doc.uid] = {};
      }
      forSaleByUid[doc.uid][doc.lang] = doc;
    }

    for (const [uid, docs] of Object.entries(forSaleByUid)) {
      const defaultDoc = Object.values(docs).find(d => d.lang && d.lang.startsWith("en")) || Object.values(docs)[0];
      
      // Create separate entries for each language
      for (const locale of locales) {
        const localePath = locale === "en-us" ? `/for-sale/${uid}` : `/${locale}/for-sale/${uid}`;
        const languageAlternates = {};
        
        for (const altLocale of locales) {
          const altPath = altLocale === "en-us" ? `/for-sale/${uid}` : `/${altLocale}/for-sale/${uid}`;
          languageAlternates[altLocale] = `${BASE_URL}${altPath}`;
        }
        
        sitemapEntries.push({
          url: `${BASE_URL}${localePath}`,
          lastModified: new Date(defaultDoc.last_publication_date),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: languageAlternates,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching for-sale properties:", error);
  }

  // Fetch and add dynamic destination pages
  try {
    const destinations = await client.getAllByType("destination", {
      lang: "*",
    });

    const destinationsByUid = {};
    for (const doc of destinations) {
      if (!destinationsByUid[doc.uid]) {
        destinationsByUid[doc.uid] = {};
      }
      destinationsByUid[doc.uid][doc.lang] = doc;
    }

    for (const [uid, docs] of Object.entries(destinationsByUid)) {
      const defaultDoc = Object.values(docs).find(d => d.lang && d.lang.startsWith("en")) || Object.values(docs)[0];
      
      // Create separate entries for each language
      for (const locale of locales) {
        const localePath = locale === "en-us" ? `/destinations/${uid}` : `/${locale}/destinations/${uid}`;
        const languageAlternates = {};
        
        for (const altLocale of locales) {
          const altPath = altLocale === "en-us" ? `/destinations/${uid}` : `/${altLocale}/destinations/${uid}`;
          languageAlternates[altLocale] = `${BASE_URL}${altPath}`;
        }
        
        sitemapEntries.push({
          url: `${BASE_URL}${localePath}`,
          lastModified: new Date(defaultDoc.last_publication_date),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: languageAlternates,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }

  // Fetch and add dynamic blog pages
  try {
    const blogPosts = await client.getAllByType("blog_single", {
      lang: "*",
    });

    const blogPostsByUid = {};
    for (const doc of blogPosts) {
      if (!blogPostsByUid[doc.uid]) {
        blogPostsByUid[doc.uid] = {};
      }
      blogPostsByUid[doc.uid][doc.lang] = doc;
    }

    for (const [uid, docs] of Object.entries(blogPostsByUid)) {
      const defaultDoc = Object.values(docs).find(d => d.lang && d.lang.startsWith("en")) || Object.values(docs)[0];
      
      // Create separate entries for each language
      for (const locale of locales) {
        const localePath = locale === "en-us" ? `/blog/${uid}` : `/${locale}/blog/${uid}`;
        const languageAlternates = {};
        
        for (const altLocale of locales) {
          const altPath = altLocale === "en-us" ? `/blog/${uid}` : `/${altLocale}/blog/${uid}`;
          languageAlternates[altLocale] = `${BASE_URL}${altPath}`;
        }
        
        sitemapEntries.push({
          url: `${BASE_URL}${localePath}`,
          lastModified: new Date(defaultDoc.last_publication_date),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: languageAlternates,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return sitemapEntries;
}
