import { canAccessLesson, isPremiumActive } from "@/lib/premium";

const future = () => new Date(Date.now() + 30 * 86400000).toISOString();
const past = () => new Date(Date.now() - 30 * 86400000).toISOString();

describe("canAccessLesson", () => {
  it("allows free user to access free lesson", () => {
    expect(canAccessLesson({ is_free: true }, null)).toBe(true);
  });

  it("blocks free user from premium lesson", () => {
    expect(
      canAccessLesson(
        { is_free: false },
        { is_premium: false, premium_expires_at: null }
      )
    ).toBe(false);
  });

  it("allows premium user to access premium lesson", () => {
    expect(
      canAccessLesson(
        { is_free: false },
        { is_premium: true, premium_expires_at: future() }
      )
    ).toBe(true);
  });

  it("blocks expired premium user from premium lesson", () => {
    expect(
      canAccessLesson(
        { is_free: false },
        { is_premium: true, premium_expires_at: past() }
      )
    ).toBe(false);
  });

  it("allows active premium user with future expiry", () => {
    expect(
      canAccessLesson(
        { is_free: false },
        { is_premium: true, premium_expires_at: future() }
      )
    ).toBe(true);
  });

  it("blocks unauthenticated user from premium lesson", () => {
    expect(canAccessLesson({ is_free: false }, null)).toBe(false);
  });
});

describe("isPremiumActive", () => {
  it("returns false when profile is null", () => {
    expect(isPremiumActive(null)).toBe(false);
  });

  it("returns false when is_premium is false", () => {
    expect(
      isPremiumActive({ is_premium: false, premium_expires_at: future() })
    ).toBe(false);
  });

  it("returns false when premium_expires_at is null", () => {
    expect(
      isPremiumActive({ is_premium: true, premium_expires_at: null })
    ).toBe(false);
  });

  it("returns false when premium has expired", () => {
    expect(
      isPremiumActive({ is_premium: true, premium_expires_at: past() })
    ).toBe(false);
  });

  it("returns true when premium is active", () => {
    expect(
      isPremiumActive({ is_premium: true, premium_expires_at: future() })
    ).toBe(true);
  });
});
