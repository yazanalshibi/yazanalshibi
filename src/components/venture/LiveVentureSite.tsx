"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import type { ServiceItem, Venture } from "@/lib/venture/types";

export function LiveVentureSite({
  venture,
  services,
}: {
  venture: Venture;
  services: ServiceItem[];
}) {
  const [tab, setTab] = useState<"home" | "services" | "book" | "contact">("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const home = venture.pages.find((p) => p.slug === "home") || venture.pages[0];

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

  function onLead(e: FormEvent) {
    e.preventDefault();
    submit("lead");
  }

  function onCheckout(e: FormEvent) {
    e.preventDefault();
    submit("checkout");
  }

  return (
    <div className="min-h-screen bg-[#0f1c24] text-[#f3f7f6]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl">{venture.name}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">Live venture</p>
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
              className={`px-3 py-1.5 ${tab === id ? "bg-[#0f766e]" : "text-white/70"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
        {tab === "home" && (
          <section className="max-w-2xl">
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight">
              {home?.headline}
            </h1>
            <p className="mt-5 text-lg text-white/70 whitespace-pre-wrap">{home?.body}</p>
            <button
              type="button"
              onClick={() => setTab("book")}
              className="mt-8 bg-[#0f766e] px-6 py-3 text-sm font-semibold"
            >
              {home?.cta || "Book now"}
            </button>
          </section>
        )}

        {tab === "services" && (
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-3xl">Services</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {services.map((s) => (
                <li key={s.id} className="border border-white/10 bg-white/5 p-5">
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-2 text-sm text-white/65">{s.description}</p>
                  <p className="mt-4 text-2xl">${s.price}</p>
                  <button
                    type="button"
                    className="mt-4 text-sm text-[#5eead4]"
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
            <h2 className="font-[family-name:var(--font-display)] text-3xl">Book & pay</h2>
            <p className="mt-2 text-sm text-white/60">
              V0.1 records a paid order immediately (demo payments).
            </p>
            <form onSubmit={onCheckout} className="mt-6 space-y-3">
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="text-black">
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={pending}
                className="bg-[#0f766e] px-5 py-3 text-sm font-semibold disabled:opacity-40"
              >
                {pending ? "Processing…" : "Confirm booking & pay"}
              </button>
            </form>
          </section>
        )}

        {tab === "contact" && (
          <section className="max-w-lg">
            <h2 className="font-[family-name:var(--font-display)] text-3xl">Contact / lead form</h2>
            <form onSubmit={onLead} className="mt-6 space-y-3">
              <input
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 p-3 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={pending}
                className="bg-[#0f766e] px-5 py-3 text-sm font-semibold disabled:opacity-40"
              >
                {pending ? "Sending…" : "Send lead"}
              </button>
            </form>
          </section>
        )}

        {message && (
          <p className="mt-8 border border-[#5eead4]/30 bg-[#0f766e]/20 p-4 text-sm" role="status">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
