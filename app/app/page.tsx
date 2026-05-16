import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const v = typeof params.v === "string" ? params.v : undefined;
  redirect(v ? `/?v=${encodeURIComponent(v)}` : "/");
}
