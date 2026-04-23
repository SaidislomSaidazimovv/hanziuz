/**
 * @jest-environment node
 *
 * These tests exercise the in-memory fallback path (no UPSTASH_REDIS_REST_URL
 * in the test env). Upstash is still the production path; this verifies the
 * fallback path used in local dev.
 */
describe("rateLimit", () => {
  let rateLimit: typeof import("@/lib/rate-limit").rateLimit;

  beforeEach(() => {
    jest.isolateModules(() => {
      const mod = require("@/lib/rate-limit");
      rateLimit = mod.rateLimit;
    });
  });

  it("allows requests within the limit", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await rateLimit("1.1.1.1", {
        limit: 5,
        windowMs: 60_000,
        name: "test-a",
      });
      expect(res.success).toBe(true);
    }
  });

  it("blocks requests over the limit", async () => {
    for (let i = 0; i < 3; i++)
      await rateLimit("2.2.2.2", { limit: 3, windowMs: 60_000, name: "test-b" });
    const res = await rateLimit("2.2.2.2", {
      limit: 3,
      windowMs: 60_000,
      name: "test-b",
    });
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
  });

  it("decrements remaining count correctly", async () => {
    const a = await rateLimit("3.3.3.3", {
      limit: 3,
      windowMs: 60_000,
      name: "test-c",
    });
    const b = await rateLimit("3.3.3.3", {
      limit: 3,
      windowMs: 60_000,
      name: "test-c",
    });
    expect(a.remaining).toBe(2);
    expect(b.remaining).toBe(1);
  });

  it("resets after the window expires", async () => {
    jest.useFakeTimers();
    const now = Date.now();
    jest.setSystemTime(now);
    for (let i = 0; i < 3; i++)
      await rateLimit("4.4.4.4", { limit: 3, windowMs: 1_000, name: "test-d" });
    expect(
      (
        await rateLimit("4.4.4.4", {
          limit: 3,
          windowMs: 1_000,
          name: "test-d",
        })
      ).success
    ).toBe(false);

    jest.setSystemTime(now + 2_000);
    expect(
      (
        await rateLimit("4.4.4.4", {
          limit: 3,
          windowMs: 1_000,
          name: "test-d",
        })
      ).success
    ).toBe(true);
    jest.useRealTimers();
  });

  it("tracks different IPs separately", async () => {
    for (let i = 0; i < 3; i++)
      await rateLimit("5.5.5.5", { limit: 3, windowMs: 60_000, name: "test-e" });
    expect(
      (
        await rateLimit("5.5.5.5", {
          limit: 3,
          windowMs: 60_000,
          name: "test-e",
        })
      ).success
    ).toBe(false);
    expect(
      (
        await rateLimit("6.6.6.6", {
          limit: 3,
          windowMs: 60_000,
          name: "test-e",
        })
      ).success
    ).toBe(true);
  });
});

describe("getIP", () => {
  let getIP: typeof import("@/lib/rate-limit").getIP;

  beforeEach(() => {
    jest.isolateModules(() => {
      getIP = require("@/lib/rate-limit").getIP;
    });
  });

  it("reads x-forwarded-for first", () => {
    const req = new Request("http://localhost/", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getIP(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost/", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getIP(req)).toBe("9.9.9.9");
  });

  it("returns localhost when nothing is set", () => {
    const req = new Request("http://localhost/");
    expect(getIP(req)).toBe("127.0.0.1");
  });
});
