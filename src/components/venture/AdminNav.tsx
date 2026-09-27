import Link from "next/link";

const LINKS = [
  { href: "", label: "Dashboard" },
  { href: "/blueprint", label: "Blueprint" },
  { href: "/builder", label: "Builder" },
  { href: "/customers", label: "Customers" },
  { href: "/bookings", label: "Bookings" },
  { href: "/products", label: "Products" },
  { href: "/performance", label: "Performance" },
  { href: "/advisor", label: "AI Advisor" },
];

export function AdminNav({
  slug,
  name,
  live,
}: {
  slug: string;
  name: string;
  live: boolean;
}) {
  return (
    <aside className="flex w-full flex-col border-b border-[var(--ink)]/10 bg-[var(--ink)] text-[var(--foam)] lg:min-h-screen lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="px-5 py-5">
        <Link href="/" className="text-xs uppercase tracking-[0.18em] text-[var(--sand)]/60">
          Live Venture OS
        </Link>
        <p className="mt-2 font-[family-name:var(--font-display)] text-lg leading-tight">{name}</p>
        <p className="mt-1 text-xs text-[var(--sand)]/55">{live ? "LIVE" : "DRAFT"} · {slug}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={`/os/${slug}${link.href}`}
            className="shrink-0 px-3 py-2 text-sm text-[var(--sand)]/80 hover:bg-white/5 hover:text-[var(--foam)]"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={`/v/${slug}`}
          className="shrink-0 px-3 py-2 text-sm text-[var(--teal)] hover:bg-white/5"
          target="_blank"
        >
          Open live site ↗
        </Link>
      </nav>
    </aside>
  );
}
