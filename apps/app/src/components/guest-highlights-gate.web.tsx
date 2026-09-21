import { type ReactNode } from 'react';

import { GUEST_FEED_LIMIT, GuestFeedContext, useGuestFeedController } from '@/lib/guest-highlights';
import { loginHref, signupHref } from '@/lib/site-links';
import { spaNavigate } from '@/lib/spa-nav';

export function GuestFeedProvider({
  signedIn,
  children,
}: {
  signedIn: boolean;
  children: ReactNode;
}) {
  const { gateOpen, setGateOpen, sticky, nextPath, contextValue } = useGuestFeedController(signedIn);
  const signup = signupHref(nextPath);
  const signin = loginHref(nextPath);

  return (
    <GuestFeedContext.Provider value={contextValue}>
      {children}
      {!signedIn && sticky && !gateOpen ? (
        <button type="button" className="hl-guest-banner" onClick={() => setGateOpen(true)}>
          Create a free account to unlock the rest of Highlights.
        </button>
      ) : null}
      {!signedIn && gateOpen ? (
        <div className="hl-guest-gate" role="dialog" aria-modal="true" aria-labelledby="hl-guest-title">
          <div className="hl-guest-card">
            <p className="hl-guest-kicker">Free preview</p>
            <h2 id="hl-guest-title">That’s the look. Sign in to keep reading.</h2>
            <p>
              Guests can sample {GUEST_FEED_LIMIT} published articles. After a couple of minutes — or once you reach
              the last preview — we ask for an account. We’ll bring you back to this piece after you sign in.
            </p>
            <a className="hl-guest-primary" href={signup} onClick={(e) => spaNavigate(signup, e)}>
              Create a free account
            </a>
            <a className="hl-guest-secondary" href={signin} onClick={(e) => spaNavigate(signin, e)}>
              Sign in
            </a>
            <button type="button" className="hl-guest-ghost" onClick={() => setGateOpen(false)}>
              Keep reading this preview
            </button>
          </div>
        </div>
      ) : null}
      <style>{gateCss}</style>
    </GuestFeedContext.Provider>
  );
}

const gateCss = `
.hl-guest-gate {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, .48);
  display: grid;
  place-items: center;
  padding: 1.25rem;
}
.hl-guest-card {
  width: min(28rem, 100%);
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem 1.4rem 1.25rem;
  box-shadow: 0 20px 50px rgb(15 23 42 / .18);
  display: flex;
  flex-direction: column;
  gap: .7rem;
}
.hl-guest-kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #6366f1;
}
.hl-guest-card h2 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: -.02em;
  color: #111827;
}
.hl-guest-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: .95rem;
}
.hl-guest-primary, .hl-guest-secondary, .hl-guest-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.65rem;
  border-radius: .55rem;
  font-weight: 700;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
}
.hl-guest-primary { background: #6366f1; color: #fff; }
.hl-guest-primary:hover { background: #4f46e5; }
.hl-guest-secondary { border: 1px solid #e5e7eb; color: #111827; background: #fff; }
.hl-guest-secondary:hover { background: #f9fafb; }
.hl-guest-ghost { border: 0; background: none; color: #6b7280; font-weight: 600; }
.hl-guest-banner {
  width: 100%;
  margin-top: .25rem;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 700;
  border-radius: .7rem;
  padding: .85rem 1rem;
  cursor: pointer;
  font: inherit;
}
`;
