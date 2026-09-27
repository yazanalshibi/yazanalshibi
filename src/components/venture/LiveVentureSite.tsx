"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import type { BrandIdentity } from "@/lib/venture/preferences";
import type { ServiceItem, Venture } from "@/lib/venture/types";
import { brandCssVars } from "@/lib/venture/brand";
import { defaultBrand } from "@/lib/venture/preferences";

export function LiveVentureSite({
  venture,
  services,
  brand: brandProp,
}: {
  venture: Venture;
  services: ServiceItem[];
  brand?: BrandIdentity;
}) {
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
    brand.radius === "sharp" ? "0px" : brand.radius === "round" ? "18px" : "8px";

  useEffect(() => {
    void fetch(`/api/ventures/${venture.slug}/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "page_view", notes: "home" }),
    });
  }, [venture.slug]);

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
          source: action === "checkout" ? "checkout" : "lead_form",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }
      if (action === "checkout") {
        setMessage(
          `Booked & paid $${data.service.price} for ${data.service.name}. Confirmation sent to CRM.`,
        );
      } else {
        setMessage("Thanks — you're in the CRM. We'll follow up shortly.");
      }
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
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] opacity-50">{brand.logoText}</p>
          <p className="text-xl" style={{ fontFamily: brand.fontDisplay }}>
            {brand.displayName}
          </p>
          <p className="text-xs opacity-50">{brand.tagline}</p>
        </div>
        <nav className="flex gap-2 text-sm">
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
              className="px-3 py-1.5"
              style={{
                background: tab === id ? brand.primary : "transparent",
                color: brand.foreground,
                borderRadius: radius,
                opacity: tab === id ? 1 : 0.7,
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
        {tab === "home" && (
          <section className="max-w-2xl">
            <h1
              className="text-5xl leading-tight"
              style={{ fontFamily: brand.fontDisplay }}
            >
              {home?.headline}
            </h1>
            <p className="mt-5 text-lg whitespace-pre-wrap" style={{ color: brand.muted }}>
              {home?.body}
            </p>
            <button
              type="button"
              onClick={() => setTab("book")}
              className="mt-8 px-6 py-3 text-sm font-semibold"
              style={{ background: brand.primary, color: brand.foreground, borderRadius: radius }}
            >
              {home?.cta || "Book now"}
            </button>
          </section>
        )}

        {tab === "services" && (
          <section>
            <h2 className="text-3xl" style={{ fontFamily: brand.fontDisplay }}>
              Services
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {services.map((s) => (
                <li
                  key={s.id}
                  className="border border-white/10 p-5"
                  style={{ background: brand.surface, borderRadius: radius }}
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-2 text-sm" style={{ color: brand.muted }}>
                    {s.description}
                  </p>
                  <p className="mt-4 text-2xl">${s.price}</p>
                  <button
                    type="button"
                    className="mt-4 text-sm"
                    style={{ color: brand.accent }}
                    onClick={() => {
                      setServiceId(s.id);
                      setTab("book");
                    }}
                  >
                    Select →
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "book" && (
          <section className="max-w-lg">
            <h2 className="text-3xl" style={{ fontFamily: brand.fontDisplay }}>
              Book & pay
            </h2>
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                submit("checkout");
              }}
              className="mt-6 space-y-3"
            >
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full p-3 text-sm outline-none"
                style={{ background: brand.surface, borderRadius: radius, color: brand.foreground }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="text-black">
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
              {(["name", "email", "phone"] as const).map((field) => (
                <input
                  key={field}
                  required={field !== "phone"}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={field === "name" ? name : field === "email" ? email : phone}
                  onChange={(e) => {
                    if (field === "name") setName(e.target.value);
                    if (field === "email") setEmail(e.target.value);
                    if (field === "phone") setPhone(e.target.value);
                  }}
                  className="w-full p-3 text-sm outline-none"
                  style={{ background: brand.surface, borderRadius: radius, color: brand.foreground }}
                />
              ))}
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-3 text-sm font-semibold disabled:opacity-40"
                style={{ background: brand.primary, color: brand.foreground, borderRadius: radius }}
              >
                {pending ? "Processing…" : "Confirm booking & pay"}
              </button>
            </form>
          </section>
        )}

        {tab === "contact" && (
          <section className="max-w-lg">
            <h2 className="text-3xl" style={{ fontFamily: brand.fontDisplay }}>
              Contact / lead form
            </h2>
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                submit("lead");
              }}
              className="mt-6 space-y-3"
            >
              <input
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-sm outline-none"
                style={{ background: brand.surface, borderRadius: radius }}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-sm outline-none"
                style={{ background: brand.surface, borderRadius: radius }}
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 text-sm outline-none"
                style={{ background: brand.surface, borderRadius: radius }}
              />
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-3 text-sm font-semibold disabled:opacity-40"
                style={{ background: brand.primary, color: brand.foreground, borderRadius: radius }}
              >
                {pending ? "Sending…" : "Send lead"}
              </button>
            </form>
          </section>
        )}

        {message && (
          <p
            className="mt-8 border p-4 text-sm"
            style={{ borderColor: brand.primary, background: brand.surface }}
            role="status"
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
