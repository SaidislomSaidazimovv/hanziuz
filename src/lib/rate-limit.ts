const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  ip: string,
  options: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestMap.set(ip, {
      count: 1,
      resetAt: now + options.windowMs,
    });
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
