module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true, // (optional)
  // ...other options
  exclude: ["/api/*", "/slice-simulator", "/message-sent"],
  transform: async (config, path) => {
    return {
      loc: path.replace("/en-us", ""), // Remove `/en-us` from paths - could get value from i18n config to make it dynamic
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
