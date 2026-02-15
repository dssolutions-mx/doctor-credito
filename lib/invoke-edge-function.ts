/**
 * Fire-and-forget invocation of Supabase Edge Functions.
 * Uses anon key for auth. Does not block or throw.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function invokeEdgeFunction(
  name: string,
  payload: Record<string, unknown>
): void {
  if (!SUPABASE_URL || !ANON_KEY) {
    console.warn("[invoke-edge-function] Missing SUPABASE_URL or ANON_KEY")
    return
  }
  const url = `${SUPABASE_URL.replace(/\/+$/, "")}/functions/v1/${name}`
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  }).catch((err) => console.error(`[invoke-edge-function] ${name} failed:`, err))
}
