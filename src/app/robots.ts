import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://lunincocktailbar.com/sitemap.xml",
    host: "https://lunincocktailbar.com",
  };
}
