import { MetadataRoute } from 'next';

const BASE = 'https://superpalpite.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/como-palpitar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/regulamento`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
