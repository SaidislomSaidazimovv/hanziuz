import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/lessons",
  "/flashcards",
  "/quiz",
  "/ai-tutor",
  "/progress",
  "/settings",
];

const authPrefixes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip auth check entirely for public pages — no Supabase call needed
  const needsAuthCheck =
    protectedPrefixes.some((p) => pathname.startsWith(p)) ||
    authPrefixes.some((p) => pathname.startsWith(p));

  if (!needsAuthCheck) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() — reads JWT from cookie locally, no network request.
  // This is fast (<1ms) vs getUser() which calls Supabase API (200-700ms).
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users away from protected routes
  if (!session && protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (session && authPrefixes.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
