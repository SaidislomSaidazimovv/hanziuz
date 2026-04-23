import { upstashHealthCheck } from "@/lib/rate-limit";

// Diagnostic endpoint. Reports whether Upstash is reachable from the runtime.
// Also verifies via SET+GET round-trip — the resulting "hz:health" key is
// visible in Upstash Data Browser with a 5-minute TTL.
export async function GET() {
  const health = await upstashHealthCheck();
  return Response.json(health);
}
