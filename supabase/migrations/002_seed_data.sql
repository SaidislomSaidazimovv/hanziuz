-- Seed HSK 1 Vocabulary (30 words)
INSERT INTO public.vocabulary (hanzi, pinyin, meaning_uz, meaning_en, hsk_level, example_sentence_zh, example_sentence_uz) VALUES
('你好', 'nǐ hǎo', 'Salom', 'Hello', 1, '你好，我是李明。', 'Salom, men Li Mingman.'),
('谢谢', 'xiè xie', 'Rahmat', 'Thank you', 1, '谢谢你的帮助。', 'Yordamingiz uchun rahmat.'),
('再见', 'zài jiàn', 'Xayr', 'Goodbye', 1, '再见，明天见！', 'Xayr, ertaga ko''rishamiz!'),
('我', 'wǒ', 'Men', 'I / Me', 1, '我是学生。', 'Men talabaman.'),
('你', 'nǐ', 'Sen', 'You', 1, '你叫什么名字？', 'Sening isming nima?'),
('他', 'tā', 'U (erkak)', 'He / Him', 1, '他是我的朋友。', 'U mening do''stim.'),
('她', 'tā', 'U (ayol)', 'She / Her', 1, '她是老师。', 'U o''qituvchi.'),
('是', 'shì', '...dir / bo''lmoq', 'To be / Is', 1, '我是中国人。', 'Men xitoylikman.'),
('不', 'bù', 'Yo''q / emas', 'Not / No', 1, '我不是医生。', 'Men shifokor emasman.'),
('好', 'hǎo', 'Yaxshi', 'Good', 1, '今天天气很好。', 'Bugun ob-havo juda yaxshi.'),
('人', 'rén', 'Odam / Kishi', 'Person', 1, '他是好人。', 'U yaxshi odam.'),
('大', 'dà', 'Katta', 'Big', 1, '这个苹果很大。', 'Bu olma juda katta.'),
('小', 'xiǎo', 'Kichik', 'Small', 1, '我有一个小猫。', 'Mening kichik mushugim bor.'),
('一', 'yī', 'Bir', 'One', 1, '我有一本书。', 'Mening bitta kitobim bor.'),
('二', 'èr', 'Ikki', 'Two', 1, '我有二个孩子。', 'Mening ikkita farzandim bor.'),
('三', 'sān', 'Uch', 'Three', 1, '三个人来了。', 'Uch kishi keldi.'),
('十', 'shí', 'O''n', 'Ten', 1, '我十岁了。', 'Men o''n yoshdaman.'),
('中国', 'zhōng guó', 'Xitoy', 'China', 1, '我在中国学习。', 'Men Xitoyda o''qiyapman.'),
('学生', 'xué shēng', 'Talaba', 'Student', 1, '我是学生。', 'Men talabaman.'),
('老师', 'lǎo shī', 'O''qituvchi', 'Teacher', 1, '她是我的老师。', 'U mening o''qituvchim.'),
('朋友', 'péng you', 'Do''st', 'Friend', 1, '他是我的好朋友。', 'U mening yaxshi do''stim.'),
('水', 'shuǐ', 'Suv', 'Water', 1, '我想喝水。', 'Men suv ichmoqchiman.'),
('吃', 'chī', 'Yemoq', 'To eat', 1, '我们吃饭吧。', 'Keling, ovqat yeylik.'),
('喝', 'hē', 'Ichmoq', 'To drink', 1, '你想喝茶吗？', 'Choy ichmoqchimisan?'),
('看', 'kàn', 'Qaramoq / Ko''rmoq', 'To look / To see', 1, '我在看书。', 'Men kitob o''qiyapman.'),
('听', 'tīng', 'Tinglamoq', 'To listen', 1, '我听音乐。', 'Men musiqa tinglayman.'),
('说', 'shuō', 'Gapirmoq', 'To speak', 1, '你会说中文吗？', 'Xitoycha gapira olasizmi?'),
('读', 'dú', 'O''qimoq', 'To read', 1, '我在读课文。', 'Men darslikni o''qiyapman.'),
('写', 'xiě', 'Yozmoq', 'To write', 1, '我会写汉字。', 'Men ierogliflarni yoza olaman.'),
('很', 'hěn', 'Juda', 'Very', 1, '今天很热。', 'Bugun juda issiq.');

-- Seed Lessons (link to vocabulary by hanzi)
-- We need the vocab IDs, so we use a CTE approach
WITH vocab AS (
  SELECT id, hanzi FROM public.vocabulary
)
INSERT INTO public.lessons (title_uz, title_zh, description_uz, hsk_level, order_num, is_free, xp_reward, content) VALUES
(
  'Salomlashish va tanishish', '问好和介绍',
  'Xitoy tilida salomlashish, xayrlashish va o''zingizni tanishtirish.',
  1, 1, true, 20,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('你好','谢谢','再见','我','你'))
),
(
  'Olmoshlar va ''bo''lmoq'' fe''li', '代词和是',
  'Shaxs olmoshlari (men, sen, u) va ''是'' fe''lini o''rganing.',
  1, 2, true, 20,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('我','你','他','她','是','不'))
),
(
  'Raqamlar va sanash', '数字',
  'Xitoy tilida 1 dan 10 gacha sanashni o''rganing.',
  1, 3, true, 25,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('一','二','三','十'))
),
(
  'Sifatlar: katta va kichik', '形容词：大和小',
  'Asosiy sifatlar va ''hěn'' (juda) so''zini ishlatish.',
  1, 4, true, 20,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('好','人','大','小','很'))
),
(
  'Kasblar: talaba va o''qituvchi', '职业：学生和老师',
  'Kasblar haqida gapirish va savol berish.',
  1, 5, true, 25,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('中国','学生','老师','朋友'))
),
(
  'Ovqatlanish: yemoq va ichmoq', '吃和喝',
  'Ovqat va ichimliklar haqida so''zlashish.',
  1, 6, false, 25,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('水','吃','喝'))
),
(
  'Kundalik fe''llar', '日常动词',
  'Ko''rmoq, tinglamoq, gapirmoq, o''qimoq, yozmoq.',
  1, 7, false, 30,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('看','听','说','读','写'))
),
(
  'Xitoy haqida suhbat', '谈谈中国',
  'Xitoy, til va madaniyat haqida oddiy suhbat.',
  1, 8, false, 30,
  (SELECT jsonb_build_object('vocab_ids', jsonb_agg(id)) FROM vocab WHERE hanzi IN ('中国','说','是','好','人'))
),
(
  'Vaqt va kun tartibi', '时间和日程',
  'Soat, kun va hafta kunlarini o''rganing.',
  2, 1, false, 30, '{"vocab_ids": []}'::jsonb
),
(
  'Transport va sayohat', '交通和旅行',
  'Transport vositalari va yo''nalishlar haqida.',
  2, 2, false, 30, '{"vocab_ids": []}'::jsonb
),
(
  'Do''konda xarid qilish', '在商店购物',
  'Narx so''rash, xarid qilish va to''lash.',
  2, 3, false, 35, '{"vocab_ids": []}'::jsonb
);
