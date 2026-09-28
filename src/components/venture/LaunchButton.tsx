"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LaunchButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/ventures/${slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "launch" }),
          });
          router.refresh();
        });
      }}
      className="bg-[var(--teal)] px-4 py-2 text-sm font-medium text-[var(--foam)] disabled:opacity-40"
    >
      {pending ? "Launching…" : "Launch live"}
    </button>
  );
}
