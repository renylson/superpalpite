import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/comprovante/'] },
    ],
    sitemap: 'https://superpalpite.com/sitemap.xml',
  };
}
