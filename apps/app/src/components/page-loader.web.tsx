import { useEffect, useState } from 'react';

import { loaderMessageAt } from '@/components/page-loader-copy';

export function PageLoader({
  fullScreen,
  compact,
  message,
}: {
  fullScreen?: boolean;
  compact?: boolean;
  message?: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (message) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), 2400);
    return () => window.clearInterval(id);
  }, [message]);

  const text = message ?? loaderMessageAt(tick);

  return (
    <div
      className={`cp-loader ${fullScreen ? 'cp-loader-full' : ''} ${compact ? 'cp-loader-compact' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <style>{css}</style>
      <span className="cp-loader-ring" aria-hidden />
      <p>{text}</p>
    </div>
  );
}

const css = `
.cp-loader { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.85rem; padding:2.5rem 1.25rem; text-align:center; }
.cp-loader-full { min-height:100vh; background:#fafafa; }
.cp-loader-compact { flex-direction:row; padding:1rem 0; gap:.65rem; text-align:left; }
.cp-loader p { margin:0; max-width:20rem; color:#6b7280; font-size:.95rem; font-weight:600; line-height:1.45; }
.cp-loader-compact p { font-size:.85rem; max-width:none; }
.cp-loader-ring {
  width:2.35rem; height:2.35rem; border-radius:999px;
  border:3px solid #e0e7ff; border-top-color:#6366f1;
  animation: cp-spin .7s linear infinite;
}
.cp-loader-compact .cp-loader-ring { width:1.15rem; height:1.15rem; border-width:2px; }
@keyframes cp-spin { to { transform: rotate(360deg); } }
`;
