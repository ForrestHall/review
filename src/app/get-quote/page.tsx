import { redirect } from "next/navigation";
import { UTM_QUERY_KEYS } from "@/lib/attribution";

export default async function GetQuoteRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const key of UTM_QUERY_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value.trim()) {
      qs.set(key, value.trim().slice(0, 200));
    }
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  redirect(`/find-coverage${suffix}`);
}
