-- 006: Seed quizzes and quiz questions (50 total)

DELETE FROM public.quiz_questions;
DELETE FROM public.quizzes;

-- HSK 1 Quiz: Salomlashish (10 questions)
WITH lesson AS (
  SELECT id FROM public.lessons WHERE title_uz = 'Salomlashish va tanishish' AND hsk_level = 1
)
INSERT INTO public.quizzes (lesson_id, title_uz, total_questions, pass_score, time_limit_seconds)
SELECT id, 'Salomlashish va Tanishish Testi', 10, 60, 180 FROM lesson;

INSERT INTO public.quiz_questions (quiz_id, question_uz, correct_answer, options, order_num)
SELECT q.id, question_uz, correct_answer, options::jsonb, order_num
FROM public.quizzes q
JOIN public.lessons l ON q.lesson_id = l.id
CROSS JOIN (VALUES
  ('你好 — bu qanday talaffuz qilinadi?', 'nǐ hǎo', '["nǐ hǎo","nǐ háo","nī hǎo","nì hào"]', 1),
  ('谢谢 — O''zbek tilida?', 'Rahmat', '["Rahmat","Salom","Xayr","Iltimos"]', 2),
  ('Xitoyda xayrlashganda qaysi so''z ishlatiladi?', '再见', '["再见","你好","谢谢","请"]', 3),
  ('对不起 = Rahmat — bu to''g''rimi?', 'Noto''g''ri', '["To''g''ri","Noto''g''ri"]', 4),
  ('"Iltimos" xitoycha?', '请', '["请","是","不","好"]', 5),
  ('没关系 nima ma''no bildiradi?', 'Mayli / Arzimas', '["Mayli / Arzimas","Rahmat","Kechirasiz","Salom"]', 6),
  ('"我" kim?', 'Men', '["Men","Sen","U","Biz"]', 7),
  ('So''roq yuklamasi qaysi?', '吗', '["吗","的","不","很"]', 8),
  ('你___，我是李明。 (Salom demoqchi)', '好', '["好","们","吗"]', 9),
  ('"的" nima vazifani bajaradi?', 'Egalik (-ning)', '["Egalik (-ning)","So''roq yuklamasi","Inkor","Ravish"]', 10)
) AS data(question_uz, correct_answer, options, order_num)
WHERE l.title_uz = 'Salomlashish va tanishish' AND l.hsk_level = 1;

-- HSK 2 Quiz 1: Yo''nalish va Manzil (10 questions)
WITH lesson AS (
  SELECT id FROM public.lessons WHERE title_uz = 'Yo''nalish va Manzil' AND hsk_level = 2
)
INSERT INTO public.quizzes (lesson_id, title_uz, total_questions, pass_score, time_limit_seconds)
SELECT id, 'Yo''nalish va Manzil Testi', 10, 60, 180 FROM lesson;

INSERT INTO public.quiz_questions (quiz_id, question_uz, correct_answer, options, order_num)
SELECT q.id, question_uz, correct_answer, options::jsonb, order_num
FROM public.quizzes q
JOIN public.lessons l ON q.lesson_id = l.id
CROSS JOIN (VALUES
  ('左边 nima degan ma''noni bildiradi?', 'Chap tomon', '["Chap tomon","O''ng tomon","Oldinda","Orqada"]', 1),
  ('"Supermarket o''ng tomonda" — xitoycha?', '超市在右边。', '["超市在右边。","超市在左边。","超市在前面。","超市在里面。"]', 2),
  ('前面 — qaysi yo''nalish?', 'Oldinda', '["Oldinda","Orqada","O''rtada","Ostida"]', 3),
  ('"Mushuk stolning ostida" — xitoycha?', '猫在桌子下面。', '["猫在桌子下面。","猫在桌子上面。","猫在桌子里面。","猫在桌子旁边。"]', 4),
  ('中间 = ''O''rtada'' — to''g''rimi?', 'To''g''ri', '["To''g''ri","Noto''g''ri"]', 5),
  ('附近 nima degan ma''no?', 'Yaqin atrofida', '["Yaqin atrofida","Uzoqda","Ichida","Ustida"]', 6),
  ('"Yaqin" xitoycha?', '近', '["近","远","快","慢"]', 7),
  ('里面 — qaysi yo''nalish?', 'Ichida', '["Ichida","Tashqarida","Ustida","Ostida"]', 8),
  ('"Maktab unga yaqin" — xitoycha?', '学校离他很近。', '["学校离他很近。","学校离他很远。","学校在他旁边。","学校在他后面。"]', 9),
  ('向左走 nima demak?', 'Chapga yuring', '["Chapga yuring","O''ngga yuring","Oldinga yuring","Orqaga yuring"]', 10)
) AS data(question_uz, correct_answer, options, order_num)
WHERE l.title_uz = 'Yo''nalish va Manzil' AND l.hsk_level = 2;

-- HSK 2 Quiz 2: Transport va Sayohat (10 questions)
WITH lesson AS (
  SELECT id FROM public.lessons WHERE title_uz = 'Transport va Sayohat' AND hsk_level = 2
)
INSERT INTO public.quizzes (lesson_id, title_uz, total_questions, pass_score, time_limit_seconds)
SELECT id, 'Transport va Sayohat Testi', 10, 60, 180 FROM lesson;

INSERT INTO public.quiz_questions (quiz_id, question_uz, correct_answer, options, order_num)
SELECT q.id, question_uz, correct_answer, options::jsonb, order_num
FROM public.quizzes q
JOIN public.lessons l ON q.lesson_id = l.id
CROSS JOIN (VALUES
  ('地铁 nima?', 'Metro', '["Metro","Avtobus","Taksi","Samolyot"]', 1),
  ('自行车 nima?', 'Velosiped', '["Velosiped","Mashina","Poyezd","Taksi"]', 2),
  ('"Men aeroportga boraman" — xitoycha?', '我去机场。', '["我去机场。","我去车站。","我去超市。","我去学校。"]', 3),
  ('票 nima degan ma''no?', 'Chipta / Bilet', '["Chipta / Bilet","Pasport","Pul","Hujjat"]', 4),
  ('公共汽车 = Avtobus — to''g''rimi?', 'To''g''ri', '["To''g''ri","Noto''g''ri"]', 5),
  ('Velosipedda maktabga boraman — 骑 yoki 坐?', '骑', '["骑","坐","走"]', 6),
  ('"Bagaj" xitoycha qanday?', '行李', '["行李","护照","票","旅行"]', 7),
  ('护照 nima?', 'Pasport', '["Pasport","Chipta","Pul","Telefon"]', 8),
  ('旅游 nima?', 'Sayohat qilmoq', '["Sayohat qilmoq","Uyga qaytmoq","Ishlamoq","O''qimoq"]', 9),
  ('"Keyingi bekat" xitoycha?', '下一站', '["下一站","上一站","前一站","左一站"]', 10)
) AS data(question_uz, correct_answer, options, order_num)
WHERE l.title_uz = 'Transport va Sayohat' AND l.hsk_level = 2;

-- HSK 2 Quiz 3: Sport va Faollik (10 questions)
WITH lesson AS (
  SELECT id FROM public.lessons WHERE title_uz = 'Sport va Faollik' AND hsk_level = 2
)
INSERT INTO public.quizzes (lesson_id, title_uz, total_questions, pass_score, time_limit_seconds)
SELECT id, 'Sport va Faollik Testi', 10, 60, 180 FROM lesson;

INSERT INTO public.quiz_questions (quiz_id, question_uz, correct_answer, options, order_num)
SELECT q.id, question_uz, correct_answer, options::jsonb, order_num
FROM public.quizzes q
JOIN public.lessons l ON q.lesson_id = l.id
CROSS JOIN (VALUES
  ('足球 nima sport?', 'Futbol', '["Futbol","Basketbol","Tennis","Suzish"]', 1),
  ('游泳 nima?', 'Suzmoq', '["Suzmoq","Yugurmoq","O''ynamoq","Raqs tushmoq"]', 2),
  ('"Men futbol o''ynayman" — xitoycha?', '我踢足球。', '["我踢足球。","我打足球。","我跑足球。","我跳足球。"]', 3),
  ('跳舞 = Raqs tushmoq — to''g''rimi?', 'To''g''ri', '["To''g''ri","Noto''g''ri"]', 4),
  ('Har kuni yuguraman — bo''sh joy?', '跑', '["跑","走","骑"]', 5),
  ('唱歌 nima?', 'Qo''shiq aytmoq', '["Qo''shiq aytmoq","Musiqa tinglash","O''yin o''ynash","Raqs tushmoq"]', 6),
  ('快 nima degan ma''no?', 'Tez', '["Tez","Sekin","Baland","Katta"]', 7),
  ('"Basketbol" uchun qaysi fe''l ishlatiladi?', '打', '["打","踢","跑","骑"]', 8),
  ('"Bolalar o''yin o''ynaydi" — xitoycha?', '孩子们玩游戏。', '["孩子们玩游戏。","孩子们做作业。","孩子们学习。","孩子们唱歌。"]', 9),
  ('慢 nima degan ma''no?', 'Sekin', '["Sekin","Tez","Baland","Kichik"]', 10)
) AS data(question_uz, correct_answer, options, order_num)
WHERE l.title_uz = 'Sport va Faollik' AND l.hsk_level = 2;

-- HSK 2 Quiz 4: Maktab va Ta''lim (10 questions)
WITH lesson AS (
  SELECT id FROM public.lessons WHERE title_uz = 'Maktab va Ta''lim' AND hsk_level = 2
)
INSERT INTO public.quizzes (lesson_id, title_uz, total_questions, pass_score, time_limit_seconds)
SELECT id, 'Maktab va Ta''lim Testi', 10, 60, 180 FROM lesson;

INSERT INTO public.quiz_questions (quiz_id, question_uz, correct_answer, options, order_num)
SELECT q.id, question_uz, correct_answer, options::jsonb, order_num
FROM public.quizzes q
JOIN public.lessons l ON q.lesson_id = l.id
CROSS JOIN (VALUES
  ('班 nima?', 'Sinf / Guruh', '["Sinf / Guruh","Dars","Kitob","Maktab"]', 1),
  ('作业 nima?', 'Uy vazifa', '["Uy vazifa","Imtihon","Natija","Baho"]', 2),
  ('考试 nima?', 'Imtihon bermoq', '["Imtihon bermoq","O''qimoq","Yozmoq","Tinglash"]', 3),
  ('成绩 nima degan ma''no?', 'Natija / Baho', '["Natija / Baho","Savol","Dars","Sinf"]', 4),
  ('难 = Qiyin — to''g''rimi?', 'To''g''ri', '["To''g''ri","Noto''g''ri"]', 5),
  ('容易 nima degan ma''no?', 'Oson', '["Oson","Qiyin","Ko''p","Oz"]', 6),
  ('"Men tushunmayman" — xitoycha?', '我不懂。', '["我不懂。","我不知道。","我不会。","我不去。"]', 7),
  ('练习 nima?', 'Mashq qilmoq', '["Mashq qilmoq","O''rganmoq","Bilmoq","So''ramoq"]', 8),
  ('正确 nima degan ma''no?', 'To''g''ri', '["To''g''ri","Noto''g''ri","Qiyin","Oson"]', 9),
  ('错 nima degan ma''no?', 'Noto''g''ri / Xato', '["Noto''g''ri / Xato","To''g''ri","Yaxshi","Yomon"]', 10)
) AS data(question_uz, correct_answer, options, order_num)
WHERE l.title_uz = 'Maktab va Ta''lim' AND l.hsk_level = 2;
