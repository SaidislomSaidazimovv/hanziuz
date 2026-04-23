import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Upstash is the production path — global, shared across all Vercel instances.
// If env vars are missing or malformed, fall back to an in-memory Map per
// process. Initialization is lazy so a bad env var doesn't crash the build
// at module-load time.
let redisInstance: Redis | null | undefined = undefined;

function getRedis(): Redis | null {
  if (redisInstance !== undefined) return redisInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token || !url.startsWith("https://")) {
    redisInstance = null;
    return null;
  }

  try {
    redisInstance = new Redis({ url, token });
  } catch (err) {
    console.warn("[rate-limit] Upstash init failed, using in-memory:", err);
    redisInstance = null;
  }
  return redisInstance;
}

// Cache Ratelimit instances per (limit, window, name) combo to avoid recreating
// them on every call. Each limiter has its own prefix so different endpoints
// don't share counters.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(
  limit: number,
  windowMs: number,
  name: string
): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const cacheKey = `${name}:${limit}:${windowMs}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;
  const windowSec = Math.max(1, Math.floor(windowMs / 1000));
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: `rl:${name}`,
    analytics: false,
  });
  limiterCache.set(cacheKey, rl);
  return rl;
}

// In-memory fallback — only used when Upstash env vars are absent.
const ipMap = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  ip: string,
  options: { limit: number; windowMs: number; name?: string }
): Promise<{ success: boolean; remaining: number }> {
  const name = options.name ?? `${options.limit}-${options.windowMs}`;
  const limiter = getLimiter(options.limit, options.windowMs, name);

  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(ip);
      return { success, remaining };
    } catch (err) {
      // Fail open on Upstash network errors — better to let a request through
      // than lock out a real user because our limiter provider is down.
      console.warn("[rate-limit] Upstash error, failing open:", err);
      return { success: true, remaining: 0 };
    }
  }

  // Fallback: in-memory, scoped per (name, ip)
  const now = Date.now();
  const key = `${name}:${ip}`;
  const record = ipMap.get(key);
  if (!record || now > record.resetAt) {
    ipMap.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1 };
  }
  if (record.count >= options.limit) {
    return { success: false, remaining: 0 };
  }
  record.count++;
  return { success: true, remaining: options.limit - record.count };
}

export function getIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
