import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon Supabase client for public server-side reads.
 *
 * Using this in a Server Component keeps the page eligible for ISR caching
 * (`export const revalidate = N`) — the cookie-based client from
 * @supabase/ssr accesses cookies, which forces Next.js to render the page
 * dynamically on every request, silently disabling `revalidate`.
 *
 * Only use for publicly-readable data (blog posts, lesson metadata, etc.)
 * — never for user-specific data, since there's no auth session attached.
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}
