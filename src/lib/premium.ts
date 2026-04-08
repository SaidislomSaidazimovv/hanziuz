export function canAccessLesson(
  lesson: { is_free: boolean },
  profile: { is_premium: boolean; premium_expires_at: string | null } | null
): boolean {
  if (lesson.is_free) return true;
  if (!profile) return false;
  if (!profile.is_premium) return false;
  if (!profile.premium_expires_at) return false;
  return new Date(profile.premium_expires_at) > new Date();
}

export function isPremiumActive(
  profile: { is_premium: boolean; premium_expires_at: string | null } | null
): boolean {
  if (!profile) return false;
  if (!profile.is_premium) return false;
  if (!profile.premium_expires_at) return false;
  return new Date(profile.premium_expires_at) > new Date();
}
