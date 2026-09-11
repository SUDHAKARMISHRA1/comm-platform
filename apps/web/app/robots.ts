import type { MetadataRoute } from 'next';

/** Admin + API host is not a public marketing site. Keep it out of search indexes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
