-- 004: Seed all 27 lessons (15 HSK-1 + 12 HSK-2)

DELETE FROM public.lessons;

-- HSK 1 Lessons (15)
INSERT INTO public.lessons (title_uz, title_zh, description_uz, hsk_level, order_num, is_free, xp_reward, content) VALUES
('Salomlashish va tanishish', '问好和介绍', 'Xitoy tilida salomlashish, xayrlashish va o''zingizni tanishtirish.', 1, 1, true, 20, '{"duration_min": 10}'),
('Olmoshlar: Men, Sen, U', '代词', 'Shaxs olmoshlarini o''rganing va jumlada qo''llang.', 1, 2, true, 20, '{"duration_min": 10}'),
('Raqamlar: 0 dan 10 gacha', '数字 0-10', 'Asosiy raqamlarni o''zbek-xitoy taqqosi bilan o''rganing.', 1, 3, true, 25, '{"duration_min": 12}'),
('Oilaviy a''zolar', '家庭成员', 'Ota, ona, aka, opa va boshqa oila a''zolari.', 1, 4, true, 20, '{"duration_min": 10}'),
('Sifatlar: Katta, Kichik, Yaxshi', '形容词基础', 'Asosiy sifatlar va ''hen'' (juda) so''zi bilan ishlatish.', 1, 5, true, 20, '{"duration_min": 10}'),
('Kasblar: Talaba va O''qituvchi', '职业', 'Kasb-hunar nomlari va ularni savolda qo''llash.', 1, 6, true, 25, '{"duration_min": 12}'),
('Vaqt: Bugun, Ertaga, Kecha', '时间表达', 'Vaqt ifodalovchi so''zlar va kundalik vaqt.', 1, 7, true, 25, '{"duration_min": 12}'),
('Ovqatlanish: Yemoq va Ichmoq', '吃和喝', 'Ovqat va ichimliklar haqida so''zlashish.', 1, 8, false, 25, '{"duration_min": 12}'),
('Asosiy fe''llar', '基础动词', 'Kelmoq, bormoq, o''qimoq, yozmoq va boshqa fe''llar.', 1, 9, false, 30, '{"duration_min": 15}'),
('Ob-havo haqida suhbat', '天气对话', 'Ob-havo va fasl haqida gapirishni o''rganing.', 1, 10, false, 25, '{"duration_min": 12}'),
('Manzil va joy', '地点和方向', 'Maktab, uy, kasalxona va yo''nalishlar.', 1, 11, false, 25, '{"duration_min": 12}'),
('Transport vositalari', '交通工具', 'Taksi, samolyot, poyezd va mashinalar.', 1, 12, false, 25, '{"duration_min": 12}'),
('Do''konda xarid', '在商店购物', 'Narx so''rash va xarid qilish.', 1, 13, false, 30, '{"duration_min": 15}'),
('Ranglar', '颜色', 'Asosiy ranglarni o''rganing.', 1, 14, false, 20, '{"duration_min": 10}'),
('HSK 1 Yakuniy Takrorlash', 'HSK1 总复习', 'HSK 1 barcha mavzularini takrorlash va imtihon.', 1, 15, false, 30, '{"duration_min": 20}'),

-- HSK 2 Lessons (12)
('Kundalik Muloqot va Iboralar', '日常对话', 'Har kuni ishlatiladigan iboralar.', 2, 1, true, 30, '{"duration_min": 15}'),
('Maktab va Ta''lim', '学校和学习', 'Sinf, uy vazifa, imtihon va o''qish.', 2, 2, true, 30, '{"duration_min": 15}'),
('Vaqt ifodalash: Tez-tez, Ba''zan, Doimo', '频率表达', 'Harakat chastotasini ifodalovchi ravishlar.', 2, 3, true, 30, '{"duration_min": 15}'),
('Yo''nalish va Manzil', '方向和位置', 'Chap, o''ng, oldinda, orqada — yo''l ko''rsatish.', 2, 4, true, 35, '{"duration_min": 18}'),
('Transport va Sayohat', '交通和旅行', 'Metro, avtobus, velosiped, aeroport va bekatlar.', 2, 5, false, 35, '{"duration_min": 18}'),
('Xarid qilish va Narx so''rash', '购物和价格', 'Do''kon va supermarketda xarid qilish.', 2, 6, false, 35, '{"duration_min": 18}'),
('Sport va Faollik', '运动和活动', 'Sport turlari, o''yin va harakatlanish fe''llari.', 2, 7, false, 30, '{"duration_min": 15}'),
('Salomatlik va Kasalxona', '健康和医院', 'Kasal bo''lish, shifokorga borish, dori olish.', 2, 8, false, 35, '{"duration_min": 18}'),
('Uy va Xona', '家和房间', 'Uy, xona, mebel va uy buyumlari haqida.', 2, 9, false, 30, '{"duration_min": 15}'),
('Ob-havo va Fasllar', '天气和季节', 'To''rt fasl, ob-havo tasvirlash va kiyinish.', 2, 10, false, 35, '{"duration_min": 18}'),
('His-tuyg''ular va Fikrlar', '感受和想法', 'Yaxshi ko''rish, his qilish, o''ylash va istaklarni ifodalash.', 2, 11, false, 35, '{"duration_min": 18}'),
('HSK 2 Yakuniy Takrorlash', 'HSK2 总复习', 'HSK 2 barcha mavzularini takrorlash va imtihon.', 2, 12, false, 45, '{"duration_min": 25}');
