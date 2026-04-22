import type { MetadataRoute } from "next";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmacia-vazquez.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categories
      .filter((c) => c.id !== "all")
      .map((c) => ({
        url: `${SITE_URL}/productos/${c.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...products.map((p) => ({
      url: `${SITE_URL}/producto/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/favoritos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/ingresar`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
