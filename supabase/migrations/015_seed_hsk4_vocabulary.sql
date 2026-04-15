-- 015: Seed HSK 4 Vocabulary — 79 words across 10 topics
-- Source: HSK4_sozlar_va_darslar.docx

DELETE FROM public.vocabulary WHERE hsk_level = 4;

INSERT INTO public.vocabulary (hanzi, pinyin, meaning_uz, meaning_en, hsk_level, example_sentence_zh, example_sentence_uz) VALUES
-- Mavzu 1: Shaxsiy Rivojlanish (10)
('目标',   'mù biāo',     'Maqsad',                          'Goal / Target',          4, '我的目标是流利地说汉语。',           'Mening maqsadim xitoy tilida ravon gapirish.'),
('努力',   'nǔ lì',       'Mehnat qilmoq / Tirishmoq',      'To work hard',            4, '只要努力，就能成功。',               'Faqat tirishsang, muvaffaqiyatga erisha olasan.'),
('坚持',   'jiān chí',    'Davom ettirmoq / Chidamoq',      'To persist',              4, '坚持就是胜利。',                     'Davom ettirish — g''alaba demakdir.'),
('放弃',   'fàng qì',     'Voz kechmoq / Tashlab ketmoq',   'To give up',              4, '不要轻易放弃。',                     'Osongina voz kechmang.'),
('成功',   'chéng gōng',  'Muvaffaqiyat',                   'Success',                 4, '他终于成功了。',                     'U nihoyat muvaffaqiyatga erishdi.'),
('失败',   'shī bài',     'Muvaffaqiyatsizlik / Yutqazmoq', 'Failure / To fail',       4, '失败是成功之母。',                   'Muvaffaqiyatsizlik — muvaffaqiyat onasi.'),
('机会',   'jī huì',      'Imkoniyat / Fursad',             'Opportunity / Chance',    4, '这是一个好机会。',                   'Bu juda yaxshi imkoniyat.'),
('梦想',   'mèng xiǎng',  'Orzu / Xayol',                   'Dream',                   4, '我的梦想是环游世界。',               'Mening orzum — dunyoni aylanib chiqish.'),
('自信',   'zì xìn',      'O''ziga ishonch',                'Self-confidence',         4, '你要更自信一点。',                   'O''zingizga ko''proq ishoning.'),
('能力',   'néng lì',     'Qobiliyat / Ko''nikma',          'Ability / Skill',         4, '他的能力很强。',                     'Uning qobiliyati juda kuchli.'),

-- Mavzu 2: Jamiyat va Munosabatlar (8)
('社会',   'shè huì',     'Jamiyat',                        'Society',                 4, '我们要为社会做贡献。',               'Biz jamiyatga hissa qo''shishimiz kerak.'),
('关系',   'guān xi',     'Munosabat / Aloqa',              'Relationship',            4, '我们的关系很好。',                   'Bizning munosabatimiz juda yaxshi.'),
('尊重',   'zūn zhòng',   'Hurmat qilmoq',                  'To respect',              4, '我们要互相尊重。',                   'Biz bir-birimizni hurmat qilishimiz kerak.'),
('责任',   'zé rèn',      'Mas''uliyat',                    'Responsibility',          4, '这是你的责任。',                     'Bu sizning mas''uliyatingiz.'),
('影响',   'yǐng xiǎng',  'Ta''sir qilmoq / Ta''sir',       'Influence / To affect',   4, '这件事影响了我。',                   'Bu voqea menga ta''sir qildi.'),
('支持',   'zhī chí',     'Qo''llab-quvvatlamoq',           'To support',              4, '谢谢你的支持！',                     'Qo''llab-quvvatlaganingiz uchun rahmat!'),
('批评',   'pī píng',     'Tanqid qilmoq',                  'To criticize',            4, '他批评了我的工作。',                 'U mening ishimni tanqid qildi.'),
('保护',   'bǎo hù',      'Himoya qilmoq',                  'To protect',              4, '我们要保护环境。',                   'Biz atrof-muhitni himoya qilishimiz kerak.'),

-- Mavzu 3: Iqtisodiyot va Moliya (8)
('经济',   'jīng jì',     'Iqtisodiyot',                    'Economy',                 4, '中国经济发展很快。',                 'Xitoy iqtisodiyoti juda tez rivojlanmoqda.'),
('投资',   'tóu zī',      'Investitsiya / Sarmoya',         'Investment',              4, '他在股市投资。',                     'U fond bozorida sarmoya kiritmoqda.'),
('利润',   'lì rùn',      'Foyda / Daromad',                'Profit',                  4, '今年公司利润很高。',                 'Bu yil kompaniya foydasi juda yuqori.'),
('价格',   'jià gé',      'Narx',                           'Price',                   4, '这个价格太贵了。',                   'Bu narx juda qimmat.'),
('消费',   'xiāo fèi',    'Iste''mol qilmoq / Sarflamoq',   'To consume / Spending',   4, '合理消费很重要。',                   'Oqilona sarflash juda muhim.'),
('储蓄',   'chǔ xù',      'Jamg''armoq / Tejash',           'To save money',           4, '每个月我都储蓄一些钱。',             'Har oyda biroz pul jamg''araman.'),
('贷款',   'dài kuǎn',    'Kredit / Qarz olmoq',            'Loan',                    4, '我申请了银行贷款。',                 'Men bank kreditiga ariza berdim.'),
('市场',   'shì chǎng',   'Bozor',                          'Market',                  4, '这个市场很大。',                     'Bu bozor juda katta.'),

-- Mavzu 4: Siyosat va Qonun (5)
('法律',   'fǎ lǜ',       'Qonun',                          'Law',                     4, '我们要遵守法律。',                   'Biz qonunga rioya qilishimiz kerak.'),
('政府',   'zhèng fǔ',    'Hukumat',                        'Government',              4, '政府出台了新政策。',                 'Hukumat yangi siyosat e''lon qildi.'),
('政策',   'zhèng cè',    'Siyosat / Dastur',               'Policy',                  4, '新政策对我们有利。',                 'Yangi siyosat bizga foydali.'),
('民主',   'mín zhǔ',     'Demokratiya',                    'Democracy',               4, '民主制度很重要。',                   'Demokratik tizim juda muhim.'),
('权利',   'quán lì',     'Huquq',                          'Right / Authority',       4, '每个人都有基本权利。',               'Har bir insonda asosiy huquqlar bor.'),

-- Mavzu 5: Madaniyat va San'at (8)
('文化',   'wén huà',     'Madaniyat',                      'Culture',                 4, '中国文化很丰富。',                   'Xitoy madaniyati juda boy.'),
('艺术',   'yì shù',      'San''at',                        'Art',                     4, '他对艺术很感兴趣。',                 'U san''atga juda qiziqadi.'),
('音乐',   'yīn yuè',     'Musiqa',                         'Music',                   4, '音乐能让人放松。',                   'Musiqa odamni bo''shatadi.'),
('电影',   'diàn yǐng',   'Kino / Film',                    'Movie / Film',            4, '我们去看电影吧。',                   'Keling, kino tomosha qilaylik.'),
('小说',   'xiǎo shuō',   'Roman / Hikoya',                 'Novel',                   4, '我在读一本有趣的小说。',             'Men qiziqarli roman o''qiyapman.'),
('传统',   'chuán tǒng',  'An''ana / Urf-odat',             'Tradition',               4, '中国有很多传统节日。',               'Xitoyda ko''plab an''anaviy bayramlar bor.'),
('习惯',   'xí guàn',     'Odat',                           'Habit / Custom',          4, '我有早起的习惯。',                   'Mening erta turish odatim bor.'),
('节日',   'jié rì',      'Bayram',                         'Festival / Holiday',      4, '春节是中国最大的节日。',             'Bahor bayrami Xitoyning eng katta bayrami.'),

-- Mavzu 6: Fan va Texnologiya (7)
('科学',   'kē xué',           'Fan',                         'Science',                     4, '科学改变了我们的生活。',     'Fan bizning hayotimizni o''zgartirdi.'),
('技术',   'jì shù',           'Texnologiya / Texnik ko''nikma', 'Technology / Technique',  4, '人工智能技术发展很快。',     'Sun''iy intellekt texnologiyasi juda tez rivojlanmoqda.'),
('发展',   'fā zhǎn',          'Rivojlanmoq / Rivojlanish',   'Development / To develop',    4, '城市发展越来越快。',         'Shahar borgan sari tezroq rivojlanmoqda.'),
('研究',   'yán jiū',          'Tadqiqot / O''rganmoq',       'Research / To study',         4, '他在大学做研究。',           'U universitetda tadqiqot qilmoqda.'),
('创新',   'chuàng xīn',       'Innovatsiya / Yangilik kiritmoq', 'Innovation',              4, '我们需要不断创新。',         'Biz doimiy ravishda yangilik kiritishimiz kerak.'),
('数据',   'shù jù',           'Ma''lumot / Data',            'Data',                        4, '这些数据很重要。',           'Bu ma''lumotlar juda muhim.'),
('人工智能', 'rén gōng zhì néng', 'Sun''iy intellekt',        'Artificial Intelligence',     4, '人工智能改变了世界。',       'Sun''iy intellekt dunyoni o''zgartirdi.'),

-- Mavzu 7: Atrof-Muhit va Ekologiya (6)
('环境',   'huán jìng',   'Atrof-muhit',                    'Environment',             4, '保护环境是我们的责任。',             'Atrof-muhitni himoya qilish bizning burchimiz.'),
('污染',   'wū rǎn',      'Ifloslanish / Ifloslantirmoq',   'Pollution',               4, '空气污染很严重。',                   'Havo ifloslanishi juda jiddiy.'),
('能源',   'néng yuán',   'Energiya',                       'Energy resource',         4, '太阳能是清洁能源。',                 'Quyosh energiyasi toza energiya manbai.'),
('自然',   'zì rán',      'Tabiat / Tabiiy',                'Nature / Natural',        4, '我喜欢大自然。',                     'Men tabiatni yoqtiraman.'),
('气候',   'qì hòu',      'Iqlim',                          'Climate',                 4, '全球气候变化很严重。',               'Global iqlim o''zgarishi juda jiddiy.'),
('地球',   'dì qiú',      'Yer sayyorasi',                  'Earth',                   4, '我们只有一个地球。',                 'Bizda faqat bitta Yer bor.'),

-- Mavzu 8: Sog'liq va Tibbiyot (7)
('手术',   'shǒu shù',    'Operatsiya',                     'Surgery / Operation',     4, '他做了心脏手术。',                   'U yurak operatsiyasidan o''tdi.'),
('症状',   'zhèng zhuàng','Belgi / Alomatlar',              'Symptom',                 4, '你有什么症状？',                     'Sizda qanday alomatlar bor?'),
('预防',   'yù fáng',     'Oldini olmoq',                   'To prevent',              4, '预防胜于治疗。',                     'Oldini olish davolashdan yaxshiroq.'),
('营养',   'yíng yǎng',   'Ozuqa / Oziqlanish',             'Nutrition',               4, '这个食物营养很丰富。',               'Bu oziq-ovqat juda ozuqali.'),
('锻炼',   'duàn liàn',   'Mashq qilmoq / Sport bilan shug''ullanmoq', 'To exercise', 4, '每天锻炼对健康有好处。',             'Har kuni mashq qilish sog''liq uchun foydali.'),
('心理',   'xīn lǐ',      'Psixologiya / Ruhiy holat',      'Psychology / Mental',     4, '心理健康很重要。',                   'Ruhiy sog''liq juda muhim.'),
('医疗',   'yī liáo',     'Tibbiy yordam',                  'Medical care',            4, '这里的医疗条件很好。',               'Bu yerdagi tibbiy sharoitlar juda yaxshi.'),

-- Mavzu 9: Murakkab Grammatika (10)
('尽管...还是', 'jǐn guǎn...hái shi', 'Garchi...baribir',        'Even though...still',        4, '尽管很难，他还是坚持了。',        'Garchi qiyin bo''lsa ham, u baribir davom ettirdi.'),
('既然...就',   'jì rán...jiù',       'Agar shunday bo''lsa...unda', 'Since...then',           4, '既然来了，就好好学吧。',          'Agar kelgan bo''lsang, yaxshilab o''qigin.'),
('除了...以外', 'chú le...yǐ wài',    '...dan tashqari',         'Apart from / Besides',        4, '除了汉语以外，我还学英语。',      'Xitoy tilidan tashqari, men ingliz tilini ham o''rganaman.'),
('尤其',       'yóu qí',             'Ayniqsa',                 'Especially',                  4, '我喜欢运动，尤其是游泳。',        'Men sport bilan shug''ullanishni yoqtiraman, ayniqsa suzishni.'),
('逐渐',       'zhú jiàn',           'Asta-sekin / Borgan sari', 'Gradually',                  4, '他的汉语逐渐提高了。',            'Uning xitoy tili asta-sekin yaxshilandi.'),
('显然',       'xiǎn rán',           'Aniq / Ravshan',          'Obviously',                   4, '显然，他没有准备好。',            'Aniqki, u tayyor emas edi.'),
('根据',       'gēn jù',             'Asosida / Ko''ra',        'Based on / According to',     4, '根据新闻报道，明天会下雨。',      'Yangilikka ko''ra, ertaga yomg''ir yog''adi.'),
('对于',       'duì yú',             'Nisbatan / Haqida',       'Regarding / As for',          4, '对于这个问题，我有不同意见。',    'Bu masala haqida mening boshqa fikrim bor.'),
('尽管',       'jǐn guǎn',           'Garchi / Qaramasdan',     'Despite / Although',          4, '尽管很忙，他还是来了。',          'Garchi juda band bo''lsa ham, u keldi.'),
('倒是',       'dào shì',            'Aslida / Aksincha',       'Actually / On the contrary',  4, '他倒是说得有道理。',              'U aslida to''g''ri gapirdi.'),

-- Mavzu 10: Fikr va Bahs (10)
('观点',   'guān diǎn',   'Nuqtai nazar / Fikr',            'Viewpoint / Opinion',     4, '你的观点很有意思。',                 'Sizning nuqtai nazaringiz juda qiziqarli.'),
('证明',   'zhèng míng',  'Isbotlamoq',                     'To prove',                4, '你需要证明你的观点。',               'Siz o''z nuqtai nazaringizni isbotlashingiz kerak.'),
('分析',   'fēn xī',      'Tahlil qilmoq',                  'To analyze',              4, '我们需要分析这个问题。',             'Biz bu muammoni tahlil qilishimiz kerak.'),
('总结',   'zǒng jié',    'Xulosa qilmoq',                  'To summarize',            4, '请总结一下今天的课。',               'Iltimos, bugungi darsni xulosalang.'),
('强调',   'qiáng diào',  'Ta''kidlamoq',                   'To emphasize',            4, '老师强调了这个问题的重要性。',       'O''qituvchi bu masalaning muhimligini ta''kidladi.'),
('逻辑',   'luó ji',      'Mantiq',                         'Logic',                   4, '你的逻辑很清楚。',                   'Sizning mantig''ingiz juda aniq.'),
('理由',   'lǐ yóu',      'Sabab / Asos',                   'Reason',                  4, '你有什么理由？',                     'Sizning qanday sababingiz bor?'),
('方面',   'fāng miàn',   'Jihat / Tomondan',               'Aspect / Side',           4, '从各个方面来看。',                   'Barcha jihatdan qarasak.'),
('态度',   'tài dù',      'Munosabat / Yondashuv',          'Attitude',                4, '你对工作的态度很好。',               'Ishga bo''lgan yondashuvingiz juda yaxshi.'),
('立场',   'lì chǎng',    'Pozitsiya / Turish nuqtasi',     'Standpoint / Position',   4, '我们的立场很明确。',                 'Bizning pozitsiyamiz juda aniq.');
