import type { MetadataRoute } from 'next';
import { products } from '@/lib/content/products';
import { occasions } from '@/lib/content/occasions';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/occasions`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/customize`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site.url}/shipping`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...occasions.map((o) => ({
      url: `${site.url}/occasions/${o.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
