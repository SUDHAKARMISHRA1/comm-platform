export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      {children}
    </div>
  );
}
