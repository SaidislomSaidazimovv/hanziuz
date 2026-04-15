-- 016: Seed HSK 3 and HSK 4 lessons + lesson-vocabulary links
-- Source: HSK3 (7 lessons) + HSK4 (9 lessons). All lessons premium (is_free=false).
-- Fix applied: HSK3 Mavzu 6 (Muloqot — 7 words) was orphaned in source doc;
-- mapped to Lesson 5 "His-Tuyg'ular va Munosabatlar" since its theme already covers "Munosabatlar".

-- HSK 3 Lessons (7)
INSERT INTO public.lessons (title_uz, title_zh, description_uz, hsk_level, order_num, is_free, xp_reward, content) VALUES
('Ta''lim va Maktab Hayoti',          '学习和学校生活', 'Imtihonlar, uy vazifasi, sinf va o''qish haqida gapirish.',                 3, 1, false, 45, '{"duration_min": 18}'),
('Ish va Biznes',                     '工作和商业',     'Kasb, kompaniya, maosh va yig''ilishlar haqida muloqot.',                  3, 2, false, 45, '{"duration_min": 18}'),
('Ob-havo va To''rt Fasl',            '天气和四季',     'Fasllar, ob-havo holati va tabiat hodisalari.',                            3, 3, false, 40, '{"duration_min": 18}'),
('Restoranda Ovqat Buyurtma Qilish',  '在餐厅点菜',     'Taomlar, ta''m va restoranda muloqot.',                                    3, 4, false, 45, '{"duration_min": 18}'),
('His-Tuyg''ular va Munosabatlar',    '情感和关系',     'Xursandlik, xafa bo''lish, g''azablanish, muhabbat va muloqot iboralari.', 3, 5, false, 50, '{"duration_min": 22}'),
('Shahar Hayoti va Joylar',           '城市生活和地点', 'Metro, park, supermarket, kutubxona va shahar.',                           3, 6, false, 45, '{"duration_min": 20}'),
('Murakkab Grammatika',               '复杂语法',       'Murakkab bog''lovchilar: garchi/lekin, agar/unda, nafaqat/balki.',         3, 7, false, 60, '{"duration_min": 25}'),

-- HSK 4 Lessons (9)
('Shaxsiy Maqsad va Rivojlanish',     '个人目标和发展',     'Maqsad qo''yish, mehnat qilish va muvaffaqiyatga erishish haqida chuqur suhbat.', 4, 1, false, 60, '{"duration_min": 25}'),
('Jamiyat va Insoniy Munosabatlar',   '社会和人际关系',     'Hurmat, mas''uliyat, ta''sir va qo''llab-quvvatlash mavzulari.',                 4, 2, false, 60, '{"duration_min": 25}'),
('Iqtisodiyot va Moliyaviy Savodxonlik', '经济和金融',      'Investitsiya, narx, kredit, bozor va tejash haqida gapirish.',                  4, 3, false, 65, '{"duration_min": 28}'),
('Siyosat, Huquq va Qonun',           '政治、法律',         'Hukumat, qonun, demokratiya va fuqaro huquqlari.',                              4, 4, false, 65, '{"duration_min": 28}'),
('Madaniyat, San''at va An''analar',  '文化、艺术和传统',   'Xitoy madaniyati, san''at turlari, bayramlar va odatlar.',                      4, 5, false, 60, '{"duration_min": 25}'),
('Fan va Texnologiya',                '科学和技术',         'Sun''iy intellekt, innovatsiya, tadqiqot va zamonaviy texnologiyalar.',         4, 6, false, 70, '{"duration_min": 30}'),
('Atrof-Muhit va Ekologiya',          '环境和生态',         'Ifloslanish, iqlim o''zgarishi, tabiat va yerni muhofaza qilish.',              4, 7, false, 65, '{"duration_min": 28}'),
('Sog''liq va Tibbiyot (Chuqur)',     '健康和医学',         'Operatsiya, belgilar, oldini olish, psixologiya va tibbiy yordam.',             4, 8, false, 65, '{"duration_min": 28}'),
('Bahs Yuritish va Mantiqiy Fikrlash', '辩论和逻辑思维',    'Fikr bildirish, isbotlash, tahlil qilish va xulosa chiqarish.',                 4, 9, false, 80, '{"duration_min": 35}');


-- ================================================================
-- HSK 3 lesson-vocabulary links
-- ================================================================

-- HSK 3 Lesson 1: Ta'lim
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ta''lim va Maktab Hayoti' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('作业','复习','练习','考试','成绩','毕业','班');

-- HSK 3 Lesson 2: Ish
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ish va Biznes' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('工作','公司','经理','工资','会议','合同','银行');

-- HSK 3 Lesson 3: Ob-havo
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ob-havo va To''rt Fasl' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('天气','下雨','下雪','季节','春天','夏天','秋天','冬天','风');

-- HSK 3 Lesson 4: Restoran
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Restoranda Ovqat Buyurtma Qilish' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('米饭','面条','蔬菜','水果','鸡','鱼','点菜','味道');

-- HSK 3 Lesson 5: His-Tuyg'ular va Munosabatlar (Mavzu 5 + orphaned Mavzu 6)
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'His-Tuyg''ular va Munosabatlar' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('高兴','难过','担心','生气','喜欢','爱','羡慕',
                  '同意','反对','建议','请问','回答','问题','解释');

-- HSK 3 Lesson 6: Shahar va Texnologiya
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Shahar Hayoti va Joylar' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('城市','农村','超市','图书馆','公园','邮局','地铁',
                  '手机','电脑','网络','发送','照片','联系');

-- HSK 3 Lesson 7: Grammatika
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Murakkab Grammatika' AND l.hsk_level = 3
  AND v.hsk_level = 3
  AND v.hanzi IN ('虽然...但是','如果...就','不但...而且','一边...一边','对',
                  '只有...才','一直','已经','还','先...然后');

-- ================================================================
-- HSK 4 lesson-vocabulary links
-- ================================================================

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Shaxsiy Maqsad va Rivojlanish' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('目标','努力','坚持','放弃','成功','失败','机会','梦想','自信','能力');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Jamiyat va Insoniy Munosabatlar' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('社会','关系','尊重','责任','影响','支持','批评','保护');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Iqtisodiyot va Moliyaviy Savodxonlik' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('经济','投资','利润','价格','消费','储蓄','贷款','市场');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Siyosat, Huquq va Qonun' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('法律','政府','政策','民主','权利');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Madaniyat, San''at va An''analar' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('文化','艺术','音乐','电影','小说','传统','习惯','节日');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Fan va Texnologiya' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('科学','技术','发展','研究','创新','数据','人工智能');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Atrof-Muhit va Ekologiya' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('环境','污染','能源','自然','气候','地球');

INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Sog''liq va Tibbiyot (Chuqur)' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('手术','症状','预防','营养','锻炼','心理','医疗');

-- HSK 4 Lesson 9: Grammatika + Bahs (combined per source doc — 20 words)
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Bahs Yuritish va Mantiqiy Fikrlash' AND l.hsk_level = 4
  AND v.hsk_level = 4
  AND v.hanzi IN ('观点','证明','分析','总结','强调','逻辑','理由','方面','态度','立场',
                  '尽管...还是','既然...就','除了...以外','尤其','逐渐','显然','根据','对于','尽管','倒是');
