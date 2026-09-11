import Head from 'expo-router/head';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { pageTitle, SITE_NAME, siteOrigin, type SeoConfig } from '@/lib/seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Sets title, description, robots, and Open Graph tags for the current Expo web route. */
export function SeoHead({ title, description, index, path }: SeoConfig) {
  const fullTitle = pageTitle(title);
  const robots = index ? 'index,follow' : 'noindex,nofollow';
  const url = `${siteOrigin()}${path}`;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertLink('canonical', url);

    const jsonLdId = 'cp-seo-jsonld';
    let jsonLd = document.getElementById(jsonLdId);
    if (index) {
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.id = jsonLdId;
        jsonLd.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        description,
        url,
      });
    } else if (jsonLd) {
      jsonLd.remove();
    }
  }, [fullTitle, description, robots, url, index]);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={url} />
    </Head>
  );
}
