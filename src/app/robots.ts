import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/cliente", "/_next"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api"],
        crawlDelay: 0.5,
      },
      {
        userAgent: ["AhrefsBot", "SemrushBot", "DotBot"],
        crawlDelay: 10,
      },
    ],
    sitemap: "https://msmashburger.page/sitemap.xml",
    host: "https://msmashburger.page",
  };
}
