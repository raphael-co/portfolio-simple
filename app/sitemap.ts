import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  const routes = ["", "/projects", "/experience", "/contact", "/about"];
  const now = new Date();
  return routes.map((r) => ({
    url: base + r,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
