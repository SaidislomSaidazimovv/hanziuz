# HanziUz - Full Documentation

> O'zbekiston uchun birinchi xitoy tili o'rganish platformasi

HSK 1-6 darslari | AI Repetitor | SRS Kartochkalar | Gamification

---

## 1. Loyiha haqida

**HanziUz** - O'zbekiston bozori uchun maxsus yaratilgan xitoy tili o'rganish platformasi. Barcha interfeys va darslar o'zbek tilida.

### Muammo
Duolingo, HelloChinese kabi platformalar faqat ingliz tilida mavjud. O'zbekistonlik o'quvchilar uchun ona tilida xitoy tili o'rganish platformasi mavjud emas.

### Yechim
- To'liq o'zbek tilidagi interfeys
- HSK 1-6 standartiga mos darslar
- AI repetitor (o'zbek tilida javob beradi)
- Ilmiy asoslangan SRS takrorlash tizimi
- Gamification (XP, streak, yutuqlar, reyting)

### Bozor imkoniyati
- Global xitoy tili o'rganish bozori yiliga 12.4% o'sib bormoqda
- O'zbekiston-Xitoy savdo hajmi 15+ mlrd dollar

---

## 2. Tech Stack

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| Next.js | 16.2.2 | Frontend + API routes (App Router) |
| TypeScript | 5.x | Tip xavfsizligi |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | CLI tool (no version) | UI komponentlar |
| Supabase | 2.x | PostgreSQL + Auth + Storage |
| @supabase/ssr | 0.10 | Server-side Supabase client |
| Groq API | - | AI Repetitor (llama-3.3-70b-versatile) |
| Framer Motion | 12.x | Animatsiyalar |
| hanzi-writer | 3.7 | Ierogliflar stroke animatsiyasi |
| lucide-react | 0.469 | Ikonkalar |
| Vercel | - | Deployment |

---

## 3. Features

### O'quv tizimi
- 27 ta dars (15 HSK-1 + 12 HSK-2)
- 4 bosqichli dars oqimi: O'rganish - Mashq - Kartochkalar - Test
- Bosqich qulflash tizimi
- HanziWriter stroke animatsiyasi
- Web Speech API talaffuz
- XP mukofot tizimi
- Avtomatik so'z o'rganish (dars yakunlanganda SRS ga qo'shiladi)

### Lug'at va Kartochkalar
- 300 ta so'z (150 HSK-1 + 150 HSK-2)
- SM-2 SRS algoritmi
- 3D flip animatsiya
- 3 ta baholash: Bilaman / Qiyin / Bilmayman

### Test tizimi
- 50 ta savol (5 ta quiz)
- 3 xil savol turi
- 15 soniyali taymer
- Streak hisoblagich

### Gamification
- Streak tizimi (3, 7, 30 kun bonuslari)
- XP ball tizimi
- 23 ta yutuq (achievement)
- Leaderboard (haftalik/oylik/umumiy)
- Kunlik maqsad: 50 XP/kun

### AI Repetitor
- Groq API (llama-3.3-70b-versatile)
- Streaming javoblar
- O'zbek tilidagi system prompt
- Chat tarixi (sessiyalar saqlanadi)
- Xitoy virtual klaviaturasi
- Bepul: 10 ta/kun, Premium: cheksiz

### Autentifikatsiya
- Email/parol + Google OAuth
- Parolni unutdim / tiklash
- Session persistence
- Auth middleware (proxy.ts)

### Premium tizimi
- Freemium model: 7 bepul, 20 premium dars
- PremiumModal upsell
- AI limit: bepul 10/kun, premium cheksiz
- Admin API: /api/admin/set-premium

### Blog
- 5 ta maqola (o'zbek tilida)
- 4 kategoriya: Darslik, Madaniyat, Maslahat, Yangilik
- O'qish progress bar
- Related maqolalar

### Bildirishnomalar va Qidiruv
- Real-time bildirishnomalar (bell icon)
- Real-time qidiruv (darslar + so'zlar)
- 300ms debounce

---

## 4. Environment Variables

```bash
cp .env.example .env.local
```

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI (Groq)
GROQ_API_KEY=your_groq_api_key

# Admin
ADMIN_SECRET=your_admin_secret_here
```

| O'zgaruvchi | Qayerdan olish |
|-------------|----------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase - Settings - API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase - Settings - API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase - Settings - API (secret) |
| GROQ_API_KEY | console.groq.com |
| ADMIN_SECRET | O'zingiz tanlang |

---

## 5. Local Setup

```bash
git clone https://github.com/SaidislomSaidazimovv/hanziuz.git
cd hanziuz
npm install
cp .env.example .env.local
# .env.local ni to'ldiring
npm run dev
# http://localhost:3000
```

---

## 6. Supabase Setup

### 6.1 Loyiha yaratish
1. supabase.com - New Project - nom: Hanziuz
2. Settings - API dan kalitlarni oling

### 6.2 Migratsiyalar — 15 ta fayl (tartib bilan SQL Editor da ishga tushiring)
1. `001_initial_schema.sql` - Asosiy jadvallar + RLS + trigger
2. `001_create_missing_tables.sql` - Qo'shimcha jadvallar
3. `002_seed_hsk1_vocabulary.sql` - 150 HSK-1 so'z
4. `003_seed_hsk2_vocabulary.sql` - 150 HSK-2 so'z
5. `004_seed_lessons.sql` - 27 dars
6. `005_seed_lesson_vocabulary.sql` - Dars-so'z bog'lanish
7. `006_seed_quizzes_questions.sql` - 5 quiz, 50 savol
8. `007_seed_achievements.sql` - 23 yutuq
9. `008_notifications.sql` - Bildirishnomalar
10. `009_daily_activity.sql` - Kunlik faollik
11. `010_blog_posts.sql` - Blog + 5 maqola
12. `011_ai_chat.sql` - Chat jadvallari
13. `012_contact_messages.sql` - Contact
14. `013_premium.sql` - Premium ustunlar

### 6.3 Mavjud foydalanuvchilar uchun profil
```sql
INSERT INTO public.profiles (id, name)
SELECT id, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

### 6.4 Auth sozlamalari
- Authentication - Providers - Email: Confirm email ON
- Authentication - URL Configuration:
  - Site URL: https://your-domain.vercel.app
  - Redirect URLs: localhost + production /auth/callback va /reset-password

### 6.5 Storage
- Storage - New bucket: `avatara` (Public: ON)

---

## 7. Google OAuth Setup

1. Google Cloud Console - APIs & Services - Credentials
2. OAuth consent screen - External
3. Create OAuth client ID - Web application
4. Redirect URI: `https://YOUR-SUPABASE-ID.supabase.co/auth/v1/callback`
5. Supabase - Authentication - Providers - Google - Client ID/Secret kiriting

---

## 8. Vercel Deployment

1. vercel.com - Import Git Repository - hanziuz
2. Settings - Environment Variables - barcha 5 ta env var qo'shing
3. Deploy
4. Post-deploy: Supabase Site URL ni Vercel domen bilan yangilang

---

## 9. API Routes

| Method | Route | Auth | Tavsif |
|--------|-------|------|--------|
| POST | /api/ai-tutor | Required | Groq streaming chat |
| POST | /api/contact | Public | Contact forma |
| POST | /api/admin/set-premium | Admin secret | Premium berish |
| GET | /auth/callback | Public | OAuth callback |

### POST /api/ai-tutor
```json
{ "messages": [{"role": "user", "content": "Salom"}], "hskLevel": 1 }
```
Response: SSE stream with `data: {"text": "..."}` chunks.

### POST /api/contact
```json
{ "name": "Ali", "email": "ali@mail.uz", "message": "Savol bor..." }
```

### POST /api/admin/set-premium
```json
{ "userId": "uuid-here", "months": 12, "secret": "your_admin_secret" }
```

---

## 10. Database Schema (16 jadval)

**profiles** - Foydalanuvchi profili (id, name, avatar_url, total_xp, streak_days, is_premium, premium_expires_at)

**lessons** - Darslar (id, title_uz, title_zh, hsk_level, order_num, is_free, xp_reward)

**vocabulary** - So'zlar (id, hanzi, pinyin, meaning_uz, meaning_en, hsk_level, example_sentence_zh/uz)

**lesson_vocabulary** - Dars-so'z many-to-many bog'lanish

**user_lesson_progress** - Foydalanuvchi dars progressi (status, score, completed_at)

**srs_reviews** - SRS kartochka ma'lumotlari (ease_factor, interval_days, next_review_at)

**quizzes** - Testlar (lesson_id, title_uz, total_questions, pass_score)

**quiz_questions** - Savol-javoblar (question_type, correct_answer, options JSONB)

**achievements** - Yutuqlar (code, title_uz, xp_reward, condition_type/value)

**user_achievements** - Foydalanuvchi yutuqlari (earned_at)

**notifications** - Bildirishnomalar (type, title_uz, is_read)

**daily_activity** - Kunlik faollik (date, xp_earned, lessons_completed, cards_reviewed)

**blog_posts** - Blog maqolalari (slug, title_uz, content_uz, category)

**ai_chat_sessions** - Chat sessiyalari (user_id, title)

**ai_chat_messages** - Chat xabarlari (session_id, role, content)

**contact_messages** - Contact xabarlar (name, email, message, status)

Batafsil schema uchun `supabase/migrations/` papkasidagi SQL fayllarni ko'ring.

---

## 11. Project Structure

```
src/
  app/
    (auth)/         - login, register, forgot-password, reset-password
    (dashboard)/    - dashboard, lessons, flashcards, quiz, ai-tutor,
                      progress, achievements, leaderboard, settings
    (pages)/        - about, blog, contact, guide, hsk-guide, pricing, privacy
    auth/callback/  - OAuth callback route
    api/            - ai-tutor, contact, admin/set-premium
  components/
    ui/             - shadcn components
    layout/         - Navbar, Sidebar, DashboardNavbar, SearchBar, NotificationBell
    landing/        - Hero, Features, FloatingCharacters, LessonPreview, Pricing, Footer
    lessons/        - LessonCard, LessonContent, HanziStroke
    flashcards/     - FlashCard
    quiz/           - QuizComponent
    ai/             - AiTutor, ChineseKeyboard
    dashboard/      - StreakCard, XPProgressCard, etc.
    premium/        - PremiumModal
  lib/
    supabase.ts     - Browser client
    supabase-server.ts - Server client
    db.ts           - 40+ database CRUD functions
    user-context.tsx - UserProvider + useUser hook
    premium.ts      - canAccessLesson, isPremiumActive
    srs-algorithm.ts - SM-2 SRS algorithm
    utils.ts        - cn() helper
  proxy.ts          - Auth middleware

supabase/migrations/ - 15 SQL migration files
```

---

## 12. Freemium Model

| | Bepul | Premium (29,000 so'm/oy) |
|---|---|---|
| HSK darslar | 7 ta (is_free=true) | Barcha 27 ta |
| AI Repetitor | 10 savol/kun | Cheksiz |
| Flashcard | Bepul dars so'zlari | Barcha so'zlar |
| Yutuqlar | Ha | Ha |
| Leaderboard | Ha | Ha |

Admin orqali premium berish:
```bash
curl -X POST https://domain/api/admin/set-premium \
  -H "Content-Type: application/json" \
  -d '{"userId": "uuid", "months": 12, "secret": "your_secret"}'
```

---

## 13. Performance

- 25 ta route (21 statik, 4 dinamik)
- 7 ta loading.tsx skeleton
- Promise.all() parallel Supabase queries
- getSession() (no network request) in proxy
- Dynamic import for hanzi-writer
- CSS GPU-accelerated floating animations
- Next.js Image optimization

---

## 14. Roadmap

- [ ] Click/Payme to'lov integratsiyasi
- [ ] HSK 3-6 kontentni kengaytirish
- [ ] Mobile app (React Native)
- [ ] Sertifikat generatsiya
- [ ] Admin dashboard
- [ ] Email bildirishnomalar
- [ ] Pronunciation scoring
- [ ] Multi-player quiz

---

## 15. Litsenziya

MIT License

---

O'zbekistondan yaratilgan
