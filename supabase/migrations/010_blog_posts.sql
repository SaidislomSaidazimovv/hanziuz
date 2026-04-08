-- 010: Blog posts table + seed 5 articles

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title_uz VARCHAR NOT NULL,
  excerpt_uz TEXT,
  content_uz TEXT NOT NULL,
  cover_image_url VARCHAR,
  author_name VARCHAR DEFAULT 'HanziUz jamoasi',
  category VARCHAR,
  read_time_minutes INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

-- Seed 5 articles

INSERT INTO public.blog_posts (slug, title_uz, excerpt_uz, content_uz, category, read_time_minutes, author_name, published_at) VALUES

(
  'xitoy-tilini-noldan-oyrganish',
  'Xitoy tilini noldan o''rganish: qayerdan boshlash kerak?',
  'Xitoy tili dunyodagi eng qadimiy va boy tillardan biri. Uni o''rganishni boshlash qiyin tuyulishi mumkin, lekin to''g''ri yondashuv bilan bu jarayon qiziqarli va samarali bo''ladi.',
  '## Xitoy tilini noldan boshlash

Xitoy tili dunyodagi eng qadimiy va boy tillardan biri. Uni o''rganishni boshlash qiyin tuyulishi mumkin, lekin to''g''ri yondashuv bilan bu jarayon qiziqarli va samarali bo''ladi.

### 1. Pinyinni o''rganing

Pinyin — bu xitoy ierogliflarining lotin harflari bilan yozilishi. Bu xitoy tilini o''rganishning birinchi qadami. Pinyin orqali siz to''g''ri talaffuzni o''rganasiz va yangi so''zlarni tezroq yodlaysiz.

Masalan:
- **你好** (*nǐ hǎo*) — Salom
- **谢谢** (*xiè xie*) — Rahmat
- **再见** (*zài jiàn*) — Xayr

### 2. HSK tizimini tushuning

HSK (汉语水平考试) — xitoy tilini bilish darajasini belgilaydigan xalqaro standart. 6 ta daraja mavjud:

- **HSK 1**: 150 so''z — eng oddiy suhbatlar
- **HSK 2**: 300 so''z — kundalik muloqot
- **HSK 3**: 600 so''z — oddiy matnlarni tushunish
- **HSK 4-6**: 1200-5000 so''z — ilg''or daraja

Boshlang''ichlar uchun HSK 1 dan boshlash tavsiya etiladi.

### 3. Har kuni mashq qiling

Til o''rganishda izchillik juda muhim. Har kuni kamida 15-30 daqiqa ajrating:

- **Ertalab**: 10 ta yangi so''z yodlang
- **Tushlik vaqti**: Kartochkalarni takrorlang
- **Kechqurun**: Tinglash mashqi qiling

### 4. SRS (Spaced Repetition) dan foydalaning

Ilmiy tadqiqotlar shuni ko''rsatadiki, ma''lum vaqt oralig''ida takrorlash uzoq muddatli xotiraga o''tishga yordam beradi. HanziUz platformasida SRS kartochkalar tizimi aynan shu maqsadda yaratilgan.

### 5. Madaniyatni ham o''rganing

Til faqat grammatika va lug''at emas. Xitoy madaniyati, an''analari va tarixi tilni chuqurroq tushunishga yordam beradi. Xitoy filmlari ko''ring, musiqalar tinglang va xitoy oshxonasi bilan tanishing.

### Xulosa

Xitoy tilini o''rganish uzoq safar, lekin har bir qadam sizi maqsadga yaqinlashtiradi. HanziUz platformasi sizga bu yo''lda eng yaxshi hamroh bo''ladi — barchasi o''zbek tilida!',
  'maslahat',
  6,
  'HanziUz jamoasi',
  '2026-04-01'
),

(
  'hsk-1-eng-muhim-150-soz',
  'HSK 1 dagi eng muhim 150 so''z',
  'HSK 1 darajasi — xitoy tilini o''rganishning birinchi bosqichi. Bu darajada 150 ta eng ko''p ishlatiladigan so''zlarni o''rganasiz.',
  '## HSK 1: 150 ta asosiy so''z

HSK 1 darajasi — xitoy tilini o''rganishning birinchi bosqichi. Bu darajada 150 ta eng ko''p ishlatiladigan so''zlarni o''rganasiz. Keling, ularni turkumlar bo''yicha ko''rib chiqamiz.

### Salomlashish so''zlari

Eng birinchi o''rganiladigan so''zlar — bu salomlashish iboralari:

- **你好** (*nǐ hǎo*) — Salom
- **谢谢** (*xiè xie*) — Rahmat
- **再见** (*zài jiàn*) — Xayr
- **对不起** (*duì bu qǐ*) — Kechirasiz
- **请** (*qǐng*) — Iltimos

### Olmoshlar

Xitoy tilida olmoshlar juda oddiy:

- **我** (*wǒ*) — Men
- **你** (*nǐ*) — Sen
- **他/她** (*tā*) — U (erkak/ayol)
- **我们** (*wǒ men*) — Biz
- **他们** (*tā men*) — Ular

### Raqamlar

Xitoy tilida raqamlar juda mantiqiy tuzilgan:

- **一** (*yī*) dan **十** (*shí*) gacha — asosiy raqamlar
- **百** (*bǎi*) — yuz
- **千** (*qiān*) — ming

### So''zlarni yodlash usullari

1. **Kartochkalar**: Har bir so''zni kartochkaga yozing — old tomoni ierogif, orqa tomoni tarjima
2. **Takrorlash**: SRS tizimi orqali to''g''ri vaqtda takrorlang
3. **Kontekst**: So''zlarni alohida emas, jumla ichida yodlang
4. **Audio**: Tinglash orqali talaffuzni mustahkamlang

### Qancha vaqt kerak?

Har kuni 30 daqiqa o''rgansangiz, HSK 1 ni 1-2 oy ichida yakunlashingiz mumkin. Asosiysi — har kuni izchil mashq qilish!

### HanziUz bilan o''rganing

HanziUz platformasida barcha 150 ta HSK 1 so''zi mavjud — pinyini, tarjimasi, misollari va audio tinglash imkoniyati bilan. Bugunoq boshlang!',
  'darslik',
  7,
  'HanziUz jamoasi',
  '2026-03-25'
),

(
  'xitoy-madaniyati-va-til',
  'Xitoy madaniyatini bilmasdan tilni o''rganib bo''lmaydi',
  'Xitoy tili va madaniyati bir-biridan ajralmas. Tilni chuqur tushunish uchun madaniyatni ham bilish zarur.',
  '## Madaniyat va til — ajralmas bog''liqlik

Xitoy tili va madaniyati bir-biridan ajralmas. Ko''plab so''z va iboralar madaniy kontekstsiz to''liq tushunilmaydi.

### Bahor bayrami (春节)

Xitoyning eng katta bayrami — Bahor bayrami (Chūn Jié). Bu bayram haqida bilish ko''plab so''z va iboralarni tushunishga yordam beradi:

- **红包** (*hóng bāo*) — qizil konvert (pul sovg''asi)
- **饺子** (*jiǎo zi*) — tushbera (bayram taomi)
- **春联** (*chūn lián*) — bahor yozuvlari
- **新年快乐** (*xīn nián kuài lè*) — Yangi yil muborak!

### Ovqat madaniyati

Xitoy oshxonasi dunyoda mashhur. Ovqat nomlari orqali ko''p so''z o''rganish mumkin:

- **米饭** (*mǐ fàn*) — guruch — Xitoyning asosiy taomi
- **面条** (*miàn tiáo*) — laghmon — shimoliy Xitoy taomi
- **茶** (*chá*) — choy — Xitoy madaniyatining ramzi

### Raqamlar va madaniyat

Xitoyda ba''zi raqamlar maxsus ma''noga ega:

- **8** (八, *bā*) — omadli raqam, chunki "boylik" so''ziga o''xshaydi
- **4** (四, *sì*) — omadsiz, chunki "o''lim" so''ziga o''xshaydi
- **6** (六, *liù*) — muammosiz, silliq ma''nosini beradi

### Muloqot madaniyati

Xitoyliklar bilan muloqot qilishda bilish kerak bo''lgan narsalar:

1. **Ism**: Avval familiya, keyin ism aytiladi
2. **Hurmat**: Kattalarni "您" (*nín*) bilan murojaat qiling
3. **Sovg''a**: Qizil rangdagi sovg''alar omadli hisoblanadi

### Xulosa

Madaniyatni bilish sizning xitoy tilini tushunishingizni tubdan o''zgartiradi. HanziUz platformasida darslar madaniy kontekst bilan boyitilgan!',
  'madaniyat',
  5,
  'HanziUz jamoasi',
  '2026-03-18'
),

(
  'uzbekiston-xitoy-savdo-tili',
  'O''zbekiston-Xitoy savdosida til bilishning ahamiyati',
  'O''zbekiston va Xitoy o''rtasidagi savdo hajmi yildan-yilga o''sib bormoqda. Xitoy tilini bilish biznesda katta ustunlik beradi.',
  '## Savdo va til: nima uchun xitoy tili muhim?

O''zbekiston va Xitoy o''rtasidagi iqtisodiy aloqalar yildan-yilga mustahkamlanmoqda. 2025-yilda ikki tomonlama savdo hajmi 15 milliard dollardan oshdi.

### O''sib borayotgan hamkorlik

Xitoy O''zbekistonning eng yirik savdo hamkorlaridan biri. Bir nechta muhim yo''nalishlar:

- **Tekstil sanoati**: O''zbekiston paxta va tayyor mahsulotlarini Xitoyga eksport qiladi
- **Texnologiya**: Xitoy kompaniyalari O''zbekistonda zavodlar qurmoqda
- **Transport**: "Bir kamar, bir yo''l" tashabbusi orqali temir yo''l va logistika
- **Qishloq xo''jaligi**: Meva va sabzavot eksporti

### Til bilish — biznesda ustunlik

Xitoy tilini bilish sizga quyidagi imkoniyatlarni beradi:

1. **To''g''ridan-to''g''ri muzokaralar**: Tarjimonchizsiz muzokara olib borish
2. **Ishonch qozonish**: Xitoy hamkorlar tilni bilgan insonni yuqori baholaydi
3. **Yaxshiroq shartlar**: Til orqali madaniy nozikliklarni tushunish
4. **Karyera imkoniyatlari**: Xitoy kompaniyalarida ishlash imkoniyati

### Qaysi soha uchun qanday so''zlar kerak?

**Savdo uchun**:
- **价格** (*jià gé*) — narx
- **合同** (*hé tong*) — shartnoma
- **公司** (*gōng sī*) — kompaniya

**Logistika uchun**:
- **运输** (*yùn shū*) — tashish
- **海关** (*hǎi guān*) — bojxona

### HSK darajasi va biznes

- **HSK 3-4**: Asosiy biznes muloqot
- **HSK 5-6**: Professional muzokara va hujjatlar

### Qanday boshlash kerak?

HanziUz platformasida HSK 1 dan boshlang. Kuniga 30 daqiqa ajrating. 6-12 oy ichida biznes muloqot darajasiga yetishingiz mumkin.

O''zbekiston va Xitoy o''rtasidagi ko''prik — bu TIL!',
  'yangilik',
  6,
  'HanziUz jamoasi',
  '2026-03-10'
),

(
  'kundalik-30-daqiqa-xitoy-tili',
  'Kuniga 30 daqiqa: xitoy tilini qanday tez o''rganish mumkin?',
  'Har kuni atigi 30 daqiqa ajratib, xitoy tilini samarali o''rganishning ilmiy asoslangan usullari.',
  '## 30 daqiqalik kundalik reja

Ko''p odamlar xitoy tilini o''rganish uchun soatlab vaqt kerak deb o''ylaydi. Aslida, har kuni izchil 30 daqiqa ham ajoyib natija beradi.

### Ilmiy asos: Spaced Repetition

Tadqiqotlar shuni ko''rsatadiki, qisqa lekin muntazam mashqlar uzoq sessiyalarga qaraganda samaraliroq. Bu tamoyil SRS (Spaced Repetition System) deb ataladi.

SRS qanday ishlaydi:
1. Yangi so''zni birinchi marta ko''rasiz
2. 1 kundan keyin takrorlaysiz
3. 3 kundan keyin yana takrorlaysiz
4. 7 kundan keyin yana
5. Har safar interval uzayadi

### 30 daqiqalik reja

Har kungi 30 daqiqani quyidagicha taqsimlang:

**Ertalab (10 daqiqa)**:
- 5 ta yangi so''z o''rganing
- Har bir so''zni 3 marta yozing
- Audio bilan talaffuzni tekshiring

**Tushlik paytida (10 daqiqa)**:
- SRS kartochkalarni takrorlang
- "Bilaman" / "Qiyin" / "Bilmayman" tugmalarini bosing
- Bu sizning xotira kuchingizni oshiradi

**Kechqurun (10 daqiqa)**:
- Qisqa test o''ting (5-10 savol)
- Kecha o''rgangan so''zlarni eslang
- Ertangi reja tuzing

### Natijalar qachon ko''rinadi?

- **1 hafta**: 35 ta yangi so''z
- **1 oy**: 150 ta so''z (HSK 1 daraja!)
- **3 oy**: 450 ta so''z
- **6 oy**: 900 ta so''z (HSK 3 ga yaqin)

### HanziUz bilan amalga oshiring

HanziUz platformasi aynan shu usulga asoslangan:

1. **Darslar**: Yangi so''zlarni o''rganing (Learn bosqichi)
2. **Kartochkalar**: SRS tizimi bilan takrorlang
3. **Testlar**: Bilimingizni sinang
4. **AI Repetitor**: Savollar bering, mashq qiling

### Seriya (Streak) kuchi

HanziUz da kunlik seriya tizimi mavjud. Har kuni kirsangiz, seriyangiz o''sadi. Bu motivatsiyani saqlashga yordam beradi.

Tadqiqotlar ko''rsatadiki, 21 kun ketma-ket mashq qilgan odam odatni shakllantirad.

### Bugundan boshlang!

30 daqiqa — bu bitta YouTube video ko''rish vaqti. Shu vaqtni xitoy tiliga sarflang va 6 oydan keyin natijani ko''rasiz!',
  'maslahat',
  5,
  'HanziUz jamoasi',
  '2026-03-05'
);
