import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

/** Static HTML shell for Expo web (lang, viewport, default meta). Per-route tags come from SeoHead. */
export default function RootHtml({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{`${SITE_TAGLINE} · ${SITE_NAME}`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#6366f1" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
