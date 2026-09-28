"use client";

import { FormEvent, useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { BrandIdentity } from "@/lib/venture/preferences";
import type { ServiceItem, Venture } from "@/lib/venture/types";
import { brandCssVars } from "@/lib/venture/brand";
import { defaultBrand } from "@/lib/venture/preferences";

function LiveVentureInner({
  venture,
  services,
  brand: brandProp,
}: {
  venture: Venture;
  services: ServiceItem[];
  brand?: BrandIdentity;
}) {
  const search = useSearchParams();
  const vr = search.get("vr") === "1";
  const brand = brandProp || venture.brand || defaultBrand(venture.name);
  const [tab, setTab] = useState<"home" | "services" | "book" | "contact">("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const home = venture.pages.find((p) => p.slug === "home") || venture.pages[0];
  const radius =
    brand.radius === "sharp" ? "0px" : brand.radius === "round" ? "22px" : vr ? "14px" : "8px";
  const pad = vr ? "px-6 py-4 text-lg" : "px-3 py-1.5 text-sm";
  const btnPad = vr ? "px-8 py-5 text-lg min-h-14" : "px-6 py-3 text-sm";

  useEffect(() => {
    void fetch(`/api/ventures/${venture.slug}/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "page_view", notes: vr ? "home_vr" : "home" }),
    });
  }, [venture.slug, vr]);

  function submit(action: "lead" | "checkout") {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch(`/api/ventures/${venture.slug}/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          name,
          email,
          phone,
          serviceId,
          source: action === "checkout" ? (vr ? "vr_checkout" : "checkout") : "lead_form",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }
      setMessage(
        action === "checkout"
          ? `Booked & paid $${data.service.price} for ${data.service.name}. Confirmation sent to CRM.`
          : "Thanks — you're in the CRM. We'll follow up shortly.",
      );
      setName("");
      setEmail("");
      setPhone("");
    });
  }

  return (
    <div
      className="min-h-screen"
      style={{
        ...brandCssVars(brand),
        background: brand.background,
        color: brand.foreground,
        fontFamily: brand.fontBody,
      }}
    >
      {vr && (
        <p className="bg-black/40 px-4 py-2 text-center text-xs uppercase tracking-[0.18em]">
          Meta glasses / Quest friendly · large targets · spatial nav
        </p>
      )}
      <header
        className={`mx-auto flex max-w-5xl items-center justify-between px-5 ${vr ? "py-8" : "py-5"}`}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] opacity-50">{brand.logoText}</p>
          <p className={vr ? "text-3xl" : "text-xl"} style={{ fontFamily: brand.fontDisplay }}>
            {brand.displayName}
          </p>
        </div>
        <nav className={`flex ${vr ? "flex-col gap-3" : "gap-2"}`}>
          {(
            [
              ["home", "Home"],
              ["services", "Services"],
              ["book", "Book"],
              ["contact", "Contact"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={pad}
              style={{
                background: tab === id ? brand.primary : "transparent",
                borderRadius: radius,
                minWidth: vr ? "10rem" : undefined,
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className={`mx-auto max-w-5xl px-5 pb-20 ${vr ? "pt-6" : "pt-10"}`}>
        {tab === "home" && (
          <section className={vr ? "max-w-3xl" : "max-w-2xl"}>
            <h1
              className={vr ? "text-6xl leading-tight" : "text-5xl leading-tight"}
              style={{ fontFamily: brand.fontDisplay }}
            >
              {home?.headline}
            </h1>
            <p className={`mt-5 whitespace-pre-wrap ${vr ? "text-2xl" : "text-lg"}`} style={{ color: brand.muted }}>
              {home?.body}
            </p>
            <button
              type="button"
              onClick={() => setTab("book")}
              className={`mt-8 font-semibold ${btnPad}`}
              style={{ background: brand.primary, borderRadius: radius }}
            >
              {home?.cta || "Book now"}
            </button>
          </section>
        )}

        {tab === "services" && (
          <ul className={`mt-2 grid gap-4 ${vr ? "" : "sm:grid-cols-3"}`}>
            {services.map((s) => (
              <li
                key={s.id}
                className="border border-white/10 p-5"
                style={{ background: brand.surface, borderRadius: radius }}
              >
                <p className={vr ? "text-2xl font-medium" : "font-medium"}>{s.name}</p>
                <p className="mt-2 opacity-70">{s.description}</p>
                <p className={`mt-4 ${vr ? "text-4xl" : "text-2xl"}`}>${s.price}</p>
                <button
                  type="button"
                  className={`mt-4 ${btnPad}`}
                  style={{ background: brand.accent, borderRadius: radius }}
                  onClick={() => {
                    setServiceId(s.id);
                    setTab("book");
                  }}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}

        {(tab === "book" || tab === "contact") && (
          <form
            className="mt-4 max-w-lg space-y-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              submit(tab === "book" ? "checkout" : "lead");
            }}
          >
            <h2 className={vr ? "text-4xl" : "text-3xl"} style={{ fontFamily: brand.fontDisplay }}>
              {tab === "book" ? "Book & pay" : "Contact"}
            </h2>
            {tab === "book" && (
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={`w-full ${vr ? "p-5 text-lg" : "p-3"}`}
                style={{ background: brand.surface, borderRadius: radius }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="text-black">
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
            )}
            <input
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${vr ? "p-5 text-lg" : "p-3"}`}
              style={{ background: brand.surface, borderRadius: radius }}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${vr ? "p-5 text-lg" : "p-3"}`}
              style={{ background: brand.surface, borderRadius: radius }}
            />
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full ${vr ? "p-5 text-lg" : "p-3"}`}
              style={{ background: brand.surface, borderRadius: radius }}
            />
            <button
              type="submit"
              disabled={pending}
              className={`font-semibold disabled:opacity-40 ${btnPad}`}
              style={{ background: brand.primary, borderRadius: radius }}
            >
              {pending ? "…" : tab === "book" ? "Confirm booking & pay" : "Send lead"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-8 border p-4" style={{ borderColor: brand.primary, background: brand.surface }}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export function LiveVentureSite(props: {
  venture: Venture;
  services: ServiceItem[];
  brand?: BrandIdentity;
}) {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center">Loading…</div>}>
      <LiveVentureInner {...props} />
    </Suspense>
  );
}
