import { notFound } from "next/navigation";
import { getVenture } from "@/lib/venture/store";
import { BuilderClient } from "@/components/venture/BuilderClient";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  return <BuilderClient venture={venture} />;
}
