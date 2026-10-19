import type { MetadataRoute } from "next";
import { pages, docHref } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/brand", ...pages.map((page) => docHref(page.slug))].map(
    (route) => ({ url: `${siteUrl}${route}` }),
  );
}
