# Changelog

All notable changes to HanziUz are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Pre-1.0 — API and schema may still change.

---

## v0.3.0 — 2026-04-12

### Security
- Added server-side daily AI limit (10 messages/day for non-premium) on `/api/ai-tutor` — previously client-side only, trivially bypassed.
- Added auth check to `/api/ai-tutor` — unauthenticated requests now rejected.
- Added in-memory IP rate limiting to all three API routes:
  - `/api/ai-tutor` — 30 req/min
  - `/api/admin/set-premium` — 5 req / 5 min
  - `/api/contact` — 3 req / hour
- New module: `src/lib/rate-limit.ts`.

### Bug fixes
- Fixed invalid `lucide-react` version in `package.json` (`^1.7.0` → `^0.469.0`). The pinned version did not exist on npm, which broke fresh clones.

### Docs
- Added `CHANGELOG.md`.
- Corrected `DOCUMENTATION.md` version table (lucide-react, shadcn/ui) and migration count (14 → 15).

---

## v0.2.0 — 2026-04-08

### Gamification
- Achievements page wired to DB (23 achievements, earn conditions).
- Leaderboard page — weekly / monthly / all-time.
- Chat session history persisted (ai_chat_sessions + ai_chat_messages).

### Lessons
- Blog CMS with 5 articles and category filtering.
- Contact form saving to `contact_messages`.

### Premium
- Premium paywall: `PremiumModal`, `canAccessLesson()`, `isPremiumActive()`.
- Freemium model: 7 free + 20 premium lessons.
- Pricing page (29,000 so'm/oy).
- Admin API: `POST /api/admin/set-premium` (service-role, secret-guarded).

### Performance
- Parallel Supabase queries via `Promise.all()` in Progress page (~60% faster load).
- Loading skeletons for dashboard pages.
- Dynamic import for `hanzi-writer`.
- Floating-character animation fix (removed translateZ overriding keyframes).

### Bug fixes
- Contact API switched from cookie-based SSR client to service-role client (cookies are unavailable for public inserts).
- Quiz timer stale-closure fix (selectedAnswerRef + inlined timeout).
- HanziWriter CSS-variable color crash — replaced with hardcoded hex.
- Landing page blank-on-back-nav — switched scroll-revealed sections to `whileInView` with `viewport={{ once: true }}`; removed conflicting animation from fixed Navbar.

### Chore
- `.docx` and `AGENTS.md` removed from git tracking.

---

## v0.1.0 — 2026-04-07

### Auth
- Supabase email/password + Google OAuth.
- Forgot-password + reset-password pages.
- `/auth/callback` route for OAuth code exchange.
- `proxy.ts` auth middleware (Next.js 16 rename of `middleware.ts`) with `getSession()` for speed.
- `UserProvider` + `useUser()` context with `refetch()` and window-focus auto-refresh.

### Lessons
- 27 lessons (15 HSK-1 + 12 HSK-2), 4-step flow: Learn → Practice → Flashcards → Quiz.
- Step-locking (prevents skipping ahead).
- HanziWriter stroke animation.
- Web Speech API pronunciation playback.
- Auto-enroll completed lesson vocabulary into SRS.

### SRS & Flashcards
- SM-2 spaced repetition algorithm (`srs-algorithm.ts`).
- 3D flip animation, three grades: Bilaman / Qiyin / Bilmayman.

### Quiz
- 5 quizzes, 50 questions, 3 question types, 15-second timer, streak counter.

### AI Tutor
- Groq `llama-3.3-70b-versatile` with SSE streaming.
- Uzbek system prompt; level-aware (HSK 1-2 / 3-4 / 5-6).
- Chinese virtual keyboard component.
- Chat UI with persisted sessions.

### Gamification (foundation)
- XP, streaks (3/7/30-day bonuses), daily 50 XP goal.
- `daily_activity` tracking for heatmap.

### Performance
- 25 routes (21 static, 4 dynamic).
- Next.js Image optimization.

---

## v0.0.1 — 2026-04-07

- Initial scaffold from `create-next-app`.
- Supabase schema (initial 16 tables) + RLS policies + seed data (300 vocab, 27 lessons, 23 achievements, 5 blog posts).
- 15 SQL migration files in `supabase/migrations/`.
