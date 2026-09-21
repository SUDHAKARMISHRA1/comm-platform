import { SITE_NAME } from '@/lib/seo';
import { spaNavigate } from '@/lib/spa-nav';
import { useAuth } from '@/providers/auth-provider';
import {
  PRACTICE_TRACKS,
  SOCIAL_LINKS,
  copyrightLine,
  practiceHref,
} from '@/lib/site-links';

function BrandMark() {
  return (
    <span className="cp-footer-mark" aria-hidden>
      <span className="cp-footer-dot" />
    </span>
  );
}

function SocialIcon({ id }: { id: string }) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (id === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M14.5 8.5h2.2V5.4h-2.2c-2.5 0-4.2 1.6-4.2 4.3v1.8H8.2v3.1h2.1V22h3.3v-7.4h2.5l.5-3.1h-3V9.8c0-.8.3-1.3 1.4-1.3Z" />
      </svg>
    );
  }
  if (id === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M22 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6ZM10.2 15.3V9.1l5.3 3.1-5.3 3.1Z" />
      </svg>
    );
  }
  if (id === 'x') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.67l-4.71-6.23-5.4 6.23H2.74l7.73-8.84L1.25 2.25H8.08l4.25 5.62 5.91-5.62Zm-1.16 17.52h1.83L7.08 4.13H5.12l10.96 15.64Z" />
      </svg>
    );
  }
  return (
    <span className="cp-footer-threads" aria-hidden>
      @
    </span>
  );
}

export function SiteFooter() {
  const { session } = useAuth();
  const signedIn = Boolean(session);
  const yearLine = copyrightLine();
  const homeHref = signedIn ? '/dashboard' : '/home';
  const highlightsHref = '/highlights';

  return (
    <footer className="cp-footer">
      <style>{footerCss}</style>
      <div className="cp-footer-inner">
        <div className="cp-footer-social">
          <p className="cp-footer-kicker">Come hang with us</p>
          <p className="cp-footer-lead">Problems, walkthroughs, and office hours — we post where you already scroll.</p>
          <p className="cp-footer-connect">Connect with us on</p>
          <div className="cp-footer-icons">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                className="cp-footer-icon"
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={item.label}
                title={item.label}
              >
                <SocialIcon id={item.id} />
              </a>
            ))}
          </div>
        </div>

        <div className="cp-footer-links">
          <nav className="cp-footer-col" aria-label="Practice">
            <p className="cp-footer-heading">Practice</p>
            {PRACTICE_TRACKS.map((track) => {
              const href = practiceHref(track.skillId, signedIn);
              return (
                <a
                  key={track.skillId}
                  href={href}
                  onClick={(e) => spaNavigate(href, e)}
                >
                  {track.label}
                </a>
              );
            })}
          </nav>
          <nav className="cp-footer-col" aria-label="About us">
            <p className="cp-footer-heading">About us</p>
            <a href={homeHref} onClick={(e) => spaNavigate(homeHref, e)}>
              Home
            </a>
            <a href={highlightsHref} onClick={(e) => spaNavigate(highlightsHref, e)}>
              Highlights
            </a>
            <a href="/contact" onClick={(e) => spaNavigate('/contact', e)}>
              Contact Us
            </a>
          </nav>
        </div>

        <div className="cp-footer-brand">
          <a
            href={homeHref}
            className="cp-footer-logo"
            onClick={(e) => spaNavigate(homeHref, e)}
            aria-label={SITE_NAME}
          >
            <BrandMark />
            <span>{SITE_NAME}</span>
          </a>
          <p className="cp-footer-copy">{yearLine}</p>
        </div>
      </div>
    </footer>
  );
}

const footerCss = `
.cp-footer {
  flex-shrink: 0;
  width: 100%;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 4rem 1rem 2.75rem;
}
@media (min-width: 768px) {
  .cp-footer { padding: 4.5rem 1.5rem 3rem; }
}
.cp-footer-inner {
  width: 100%;
  max-width: 76rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.25rem;
  min-height: 12.5rem;
}
@media (min-width: 900px) {
  .cp-footer-inner {
    grid-template-columns: minmax(14rem, 1fr) minmax(18rem, 1.2fr) minmax(12rem, .9fr);
    align-items: stretch;
    gap: 2.5rem 3rem;
  }
}
.cp-footer-social {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: .55rem;
}
.cp-footer-kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #6366f1;
}
.cp-footer-lead {
  margin: 0;
  max-width: 18rem;
  color: #6b7280;
  font-size: .875rem;
  line-height: 1.55;
}
.cp-footer-connect {
  margin: .35rem 0 0;
  color: #111827;
  font-size: .8125rem;
  font-weight: 700;
}
.cp-footer-icons { display: flex; flex-wrap: wrap; gap: .55rem; }
.cp-footer-icon {
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border: 1px solid #e5e7eb;
  border-radius: .7rem;
  color: #374151;
  background: #f9fafb;
  text-decoration: none;
  transition: border-color .12s, background .12s, color .12s, transform .12s;
}
.cp-footer-icon:hover {
  color: #4f46e5;
  border-color: #c7d2fe;
  background: #eef2ff;
  transform: translateY(-1px);
}
.cp-footer-threads {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -.04em;
}
.cp-footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.cp-footer-col { display: flex; flex-direction: column; gap: .55rem; }
.cp-footer-heading {
  margin: 0 0 .2rem;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #111827;
}
.cp-footer-col a {
  color: #4b5563;
  text-decoration: none;
  font-size: .9rem;
  font-weight: 600;
  width: fit-content;
}
.cp-footer-col a:hover { color: #4f46e5; }
.cp-footer-brand {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: .75rem;
  text-align: left;
}
@media (min-width: 900px) {
  .cp-footer-brand {
    align-items: flex-end;
    text-align: right;
  }
}
.cp-footer-logo {
  display: flex;
  align-items: center;
  gap: .65rem;
  text-decoration: none;
  color: #111827;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -.02em;
}
.cp-footer-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: .65rem;
  background: #eef2ff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.cp-footer-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #6366f1;
}
.cp-footer-copy {
  margin: 0;
  max-width: 16rem;
  color: #9ca3af;
  font-size: .78rem;
  line-height: 1.5;
}
`;
