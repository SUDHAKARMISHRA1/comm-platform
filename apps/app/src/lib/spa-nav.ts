import { router, type Href } from 'expo-router';
import type { MouseEvent } from 'react';

/** Client-side navigation on Expo web so a full page load cannot drop the in-memory session. */
export function spaNavigate(href: string, event?: MouseEvent) {
  if (event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
  }
  router.push(href as Href);
}
