import { notFound } from "next/navigation";
import { getVenture } from "@/lib/venture/store";
import { BlueprintClient } from "@/components/venture/BlueprintClient";

export default async function BlueprintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  return <BlueprintClient venture={venture} />;
}
