/**
 * @jest-environment node
 */
describe("rateLimit", () => {
  let rateLimit: typeof import("@/lib/rate-limit").rateLimit;
  let getIP: typeof import("@/lib/rate-limit").getIP;

  beforeEach(() => {
    jest.isolateModules(() => {
      const mod = require("@/lib/rate-limit");
      rateLimit = mod.rateLimit;
      getIP = mod.getIP;
    });
  });

  it("allows requests within the limit", () => {
    for (let i = 0; i < 5; i++) {
      const res = rateLimit("1.1.1.1", { limit: 5, windowMs: 60_000 });
      expect(res.success).toBe(true);
    }
  });

  it("blocks requests over the limit", () => {
    for (let i = 0; i < 3; i++) rateLimit("2.2.2.2", { limit: 3, windowMs: 60_000 });
    const res = rateLimit("2.2.2.2", { limit: 3, windowMs: 60_000 });
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
  });

  it("decrements remaining count correctly", () => {
    const a = rateLimit("3.3.3.3", { limit: 3, windowMs: 60_000 });
    const b = rateLimit("3.3.3.3", { limit: 3, windowMs: 60_000 });
    expect(a.remaining).toBe(2);
    expect(b.remaining).toBe(1);
  });

  it("resets after the window expires", () => {
    jest.useFakeTimers();
    const now = Date.now();
    jest.setSystemTime(now);
    for (let i = 0; i < 3; i++) rateLimit("4.4.4.4", { limit: 3, windowMs: 1_000 });
    expect(
      rateLimit("4.4.4.4", { limit: 3, windowMs: 1_000 }).success
    ).toBe(false);

    jest.setSystemTime(now + 2_000);
    expect(
      rateLimit("4.4.4.4", { limit: 3, windowMs: 1_000 }).success
    ).toBe(true);
    jest.useRealTimers();
  });

  it("tracks different IPs separately", () => {
    for (let i = 0; i < 3; i++) rateLimit("5.5.5.5", { limit: 3, windowMs: 60_000 });
    expect(
      rateLimit("5.5.5.5", { limit: 3, windowMs: 60_000 }).success
    ).toBe(false);
    expect(
      rateLimit("6.6.6.6", { limit: 3, windowMs: 60_000 }).success
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
