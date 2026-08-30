import { router, type Href } from 'expo-router';
import type { MouseEvent } from 'react';

/** Keep Expo web on the client router so a full document load cannot drop the session. */
export function spaNavigate(href: string, event?: MouseEvent) {
  if (event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
  }
  router.push(href as Href);
}
