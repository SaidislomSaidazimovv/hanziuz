-- 002: Seed HSK 1 Vocabulary — 150 words
-- Deletes existing HSK 1 vocab and re-inserts all 150 words

DELETE FROM public.vocabulary WHERE hsk_level = 1;

INSERT INTO public.vocabulary (hanzi, pinyin, meaning_uz, meaning_en, hsk_level, example_sentence_zh, example_sentence_uz) VALUES
-- 1.1 Salomlashish (Greetings) — 10
('你好', 'nǐ hǎo', 'Salom', 'Hello', 1, '你好，我是李明。', 'Salom, men Li Mingman.'),
('再见', 'zài jiàn', 'Xayr', 'Goodbye', 1, '再见，明天见！', 'Xayr, ertaga ko''rishamiz!'),
('谢谢', 'xiè xie', 'Rahmat', 'Thank you', 1, '谢谢你的帮助。', 'Yordamingiz uchun rahmat.'),
('对不起', 'duì bu qǐ', 'Kechirasiz', 'Sorry', 1, '对不起，我迟到了。', 'Kechirasiz, kechikdim.'),
('没关系', 'méi guān xi', 'Mayli / Arzimas', 'Never mind', 1, '没关系，没事。', 'Mayli, muhim emas.'),
('请', 'qǐng', 'Iltimos / Marhamat', 'Please', 1, '请坐。', 'Marhamat, o''tiring.'),
('是', 'shì', 'Bo''lmoq / Ha', 'To be / Yes', 1, '我是学生。', 'Men talabaman.'),
('不', 'bù', 'Yo''q / Emas', 'No / Not', 1, '我不是医生。', 'Men shifokor emasman.'),
('的', 'de', 'ning (egalik)', 'Possessive', 1, '我的书。', 'Mening kitobim.'),
('吗', 'ma', '(so''roq yuklamasi)', 'Question particle', 1, '你好吗？', 'Yaxshimisiz?'),

-- 1.2 Olmoshlar (Pronouns) — 13
('我', 'wǒ', 'Men', 'I / Me', 1, '我是学生。', 'Men talabaman.'),
('你', 'nǐ', 'Sen', 'You', 1, '你叫什么名字？', 'Sening isming nima?'),
('他', 'tā', 'U (erkak)', 'He / Him', 1, '他是我的朋友。', 'U mening do''stim.'),
('她', 'tā', 'U (ayol)', 'She / Her', 1, '她是老师。', 'U o''qituvchi.'),
('我们', 'wǒ men', 'Biz', 'We / Us', 1, '我们是同学。', 'Biz sinfdoshimiz.'),
('你们', 'nǐ men', 'Sizlar', 'You (plural)', 1, '你们好！', 'Sizlarga salom!'),
('他们', 'tā men', 'Ular', 'They / Them', 1, '他们是学生。', 'Ular talaba.'),
('这', 'zhè', 'Bu', 'This', 1, '这是我的书。', 'Bu mening kitobim.'),
('那', 'nà', 'U / O''sha', 'That', 1, '那是什么？', 'U narsa nima?'),
('什么', 'shén me', 'Nima', 'What', 1, '这是什么？', 'Bu nima?'),
('谁', 'shuí', 'Kim', 'Who', 1, '他是谁？', 'U kim?'),
('哪', 'nǎ', 'Qaysi', 'Which', 1, '你是哪国人？', 'Siz qaysi mamlakatdansiz?'),
('哪里', 'nǎ lǐ', 'Qayerda', 'Where', 1, '你在哪里？', 'Sen qayerdasen?'),

-- 1.3 Raqamlar (Numbers) — 15
('零', 'líng', 'Nol', 'Zero', 1, '电话号码010。', 'Telefon raqami 010.'),
('一', 'yī', 'Bir', 'One', 1, '我有一本书。', 'Mening bitta kitobim bor.'),
('二', 'èr', 'Ikki', 'Two', 1, '二个孩子。', 'Ikki bola.'),
('三', 'sān', 'Uch', 'Three', 1, '三个人来了。', 'Uch kishi keldi.'),
('四', 'sì', 'To''rt', 'Four', 1, '四月很漂亮。', 'Aprel juda chiroyli.'),
('五', 'wǔ', 'Besh', 'Five', 1, '五个苹果。', 'Beshta olma.'),
('六', 'liù', 'Olti', 'Six', 1, '六点起床。', 'Oltida uyg''onaman.'),
('七', 'qī', 'Yetti', 'Seven', 1, '一个星期七天。', 'Bir haftada yetti kun.'),
('八', 'bā', 'Sakkiz', 'Eight', 1, '八月很热。', 'Avgust juda issiq.'),
('九', 'jiǔ', 'To''qqiz', 'Nine', 1, '九个月。', 'To''qqiz oy.'),
('十', 'shí', 'O''n', 'Ten', 1, '我十岁了。', 'Men o''n yoshdaman.'),
('百', 'bǎi', 'Yuz', 'Hundred', 1, '一百元。', 'Yuz yuan.'),
('千', 'qiān', 'Ming', 'Thousand', 1, '一千块。', 'Ming so''m.'),
('万', 'wàn', 'O''n ming', 'Ten thousand', 1, '一万人。', 'O''n ming kishi.'),
('两', 'liǎng', 'Ikki (miqdor)', 'Two (amount)', 1, '两个朋友。', 'Ikki do''st.'),

-- 1.4 Vaqt (Time) — 13
('年', 'nián', 'Yil', 'Year', 1, '今年是好年。', 'Bu yil yaxshi yil.'),
('月', 'yuè', 'Oy', 'Month', 1, '这个月很忙。', 'Bu oy juda band.'),
('日', 'rì', 'Kun', 'Day/Date', 1, '今天几号？', 'Bugun nechanchi?'),
('今天', 'jīn tiān', 'Bugun', 'Today', 1, '今天天气好。', 'Bugun ob-havo yaxshi.'),
('明天', 'míng tiān', 'Ertaga', 'Tomorrow', 1, '明天见！', 'Ertaga ko''rishamiz!'),
('昨天', 'zuó tiān', 'Kecha', 'Yesterday', 1, '昨天我去学校了。', 'Kecha maktabga bordim.'),
('上午', 'shàng wǔ', 'Ertalab', 'Morning', 1, '上午学习。', 'Ertalab o''qiyman.'),
('下午', 'xià wǔ', 'Tushdan keyin', 'Afternoon', 1, '下午休息。', 'Tushdan keyin dam olaman.'),
('晚上', 'wǎn shang', 'Kechqurun', 'Evening', 1, '晚上吃饭了吗？', 'Kechqurun ovqat yedingizmi?'),
('时候', 'shí hou', 'Vaqt / Payt', 'Time / When', 1, '什么时候来？', 'Qachon kelasiz?'),
('现在', 'xiàn zài', 'Hozir', 'Now', 1, '现在几点？', 'Hozir soat necha?'),
('点', 'diǎn', 'Soat (vaqt)', 'O''clock', 1, '现在三点。', 'Hozir soat uch.'),
('分钟', 'fēn zhōng', 'Daqiqa', 'Minute', 1, '五分钟后来。', 'Besh daqiqadan keyin kel.'),

-- 1.5 Oila (Family) — 8
('爸爸', 'bà ba', 'Ota / Dadam', 'Father / Dad', 1, '爸爸是医生。', 'Otam shifokor.'),
('妈妈', 'mā ma', 'Ona / Oyim', 'Mother / Mom', 1, '妈妈做饭。', 'Oyim ovqat pishiradi.'),
('哥哥', 'gē ge', 'Aka', 'Older brother', 1, '哥哥很高。', 'Akam juda baland bo''yli.'),
('姐姐', 'jiě jie', 'Opa', 'Older sister', 1, '姐姐很漂亮。', 'Opam juda chiroyli.'),
('弟弟', 'dì di', 'Uka', 'Younger brother', 1, '弟弟六岁。', 'Ukam olti yoshda.'),
('妹妹', 'mèi mei', 'Singil', 'Younger sister', 1, '妹妹很可爱。', 'Singilim juda yoqimli.'),
('儿子', 'ér zi', 'O''g''il', 'Son', 1, '我有一个儿子。', 'Mening bir o''g''lim bor.'),
('女儿', 'nǚ ér', 'Qiz (farzand)', 'Daughter', 1, '她女儿很聪明。', 'Uning qizi juda aqlli.'),

-- 1.6 Kasblar (Professions) — 4
('学生', 'xué shēng', 'Talaba / O''quvchi', 'Student', 1, '我是学生。', 'Men talabaman.'),
('老师', 'lǎo shī', 'O''qituvchi', 'Teacher', 1, '她是好老师。', 'U yaxshi o''qituvchi.'),
('医生', 'yī shēng', 'Shifokor', 'Doctor', 1, '爸爸是医生。', 'Dadam shifokor.'),
('朋友', 'péng you', 'Do''st', 'Friend', 1, '他是我的好朋友。', 'U mening yaxshi do''stim.'),

-- 1.7 Joylar (Places) — 7
('学校', 'xué xiào', 'Maktab / Universitet', 'School', 1, '我去学校。', 'Men maktabga boraman.'),
('家', 'jiā', 'Uy / Oila', 'Home / Family', 1, '我在家。', 'Men uydaman.'),
('中国', 'zhōng guó', 'Xitoy', 'China', 1, '我在中国学习。', 'Men Xitoyda o''qiyman.'),
('北京', 'běi jīng', 'Pekin', 'Beijing', 1, '北京很大。', 'Pekin juda katta.'),
('饭店', 'fàn diàn', 'Restoran / Mehmonxona', 'Restaurant', 1, '去饭店吃饭。', 'Restorantga ovqat yeyishga boramiz.'),
('商店', 'shāng diàn', 'Do''kon', 'Store / Shop', 1, '那个商店很大。', 'U do''kon juda katta.'),
('医院', 'yī yuàn', 'Kasalxona', 'Hospital', 1, '医院在哪里？', 'Kasalxona qayerda?'),

-- 1.8 Ovqat va Ichimlik (Food & Drink) — 8
('水', 'shuǐ', 'Suv', 'Water', 1, '我想喝水。', 'Men suv ichmoqchiman.'),
('茶', 'chá', 'Choy', 'Tea', 1, '你喝茶吗？', 'Choy ichasizmi?'),
('咖啡', 'kā fēi', 'Qahva', 'Coffee', 1, '我喝咖啡。', 'Men qahva ichaman.'),
('米饭', 'mǐ fàn', 'Guruch oshi', 'Rice', 1, '我吃米饭。', 'Men guruch ovqati yeyman.'),
('面条', 'miàn tiáo', 'Makaron / Laghmon', 'Noodles', 1, '我喜欢吃面条。', 'Men laghmon yeyishni yaxshi ko''raman.'),
('苹果', 'píng guǒ', 'Olma', 'Apple', 1, '苹果很甜。', 'Olma juda shirin.'),
('鸡蛋', 'jī dàn', 'Tuxum', 'Egg', 1, '我吃鸡蛋。', 'Men tuxum yeyman.'),
('肉', 'ròu', 'Go''sht', 'Meat', 1, '我不吃肉。', 'Men go''sht yemayman.'),

-- 1.9 Fe''llar (Verbs) — 25
('吃', 'chī', 'Yemoq', 'To eat', 1, '我们吃饭吧。', 'Keling, ovqat yeylik.'),
('喝', 'hē', 'Ichmoq', 'To drink', 1, '你想喝茶吗？', 'Choy ichmoqchimisan?'),
('看', 'kàn', 'Qaramoq / Ko''rmoq', 'To look / See', 1, '我在看书。', 'Men kitob o''qiyapman.'),
('听', 'tīng', 'Tinglamoq', 'To listen', 1, '我听音乐。', 'Men musiqa tinglayman.'),
('说', 'shuō', 'Gapirmoq', 'To speak', 1, '你会说中文吗？', 'Xitoycha gapira olasizmi?'),
('读', 'dú', 'O''qimoq', 'To read', 1, '我在读课文。', 'Men darslikni o''qiyapman.'),
('写', 'xiě', 'Yozmoq', 'To write', 1, '我会写汉字。', 'Men ierogliflarni yoza olaman.'),
('来', 'lái', 'Kelmoq', 'To come', 1, '他来了。', 'U keldi.'),
('去', 'qù', 'Bormoq', 'To go', 1, '我去学校。', 'Men maktabga boraman.'),
('有', 'yǒu', 'Bor (mavjud)', 'To have', 1, '我有两本书。', 'Mening ikkita kitobim bor.'),
('没有', 'méi yǒu', 'Yo''q (mavjud emas)', 'Don''t have', 1, '我没有钱。', 'Menda pul yo''q.'),
('想', 'xiǎng', 'Xohlamoq / O''ylamoq', 'To want/think', 1, '我想去中国。', 'Men Xitoyga bormoqchiman.'),
('喜欢', 'xǐ huān', 'Yaxshi ko''rmoq', 'To like', 1, '我喜欢学习。', 'Men o''qishni yaxshi ko''raman.'),
('知道', 'zhī dào', 'Bilmoq', 'To know', 1, '我不知道。', 'Men bilmayman.'),
('叫', 'jiào', 'Ismida atalmoq', 'To be called', 1, '我叫张明。', 'Mening ismim Zhang Ming.'),
('住', 'zhù', 'Yashamoq', 'To live', 1, '我住在北京。', 'Men Pekinda yashayman.'),
('学习', 'xué xí', 'O''qimoq / O''rganmoq', 'To study', 1, '我学习中文。', 'Men xitoy tilini o''rganyapman.'),
('工作', 'gōng zuò', 'Ishlamoq / Ish', 'To work / Job', 1, '我在公司工作。', 'Men kompaniyada ishlayman.'),
('休息', 'xiū xi', 'Dam olmoq', 'To rest', 1, '我想休息一下。', 'Men biroz dam olmoqchiman.'),
('睡觉', 'shuì jiào', 'Uxlamoq', 'To sleep', 1, '晚上十点睡觉。', 'Kechqurun soat o''nda uxlayman.'),
('起床', 'qǐ chuáng', 'Uyg''onmoq', 'To get up', 1, '我六点起床。', 'Men soat oltida uyg''onaman.'),
('买', 'mǎi', 'Sotib olmoq', 'To buy', 1, '我买苹果。', 'Men olma sotib olaman.'),
('开', 'kāi', 'Ochmoq / Haydamoq', 'To open / Drive', 1, '请开门。', 'Iltimos, eshikni oching.'),
('回', 'huí', 'Qaytmoq', 'To return', 1, '我回家了。', 'Men uyga qaytdim.'),
('坐', 'zuò', 'O''tirmoq / Minmoq', 'To sit / Ride', 1, '请坐！', 'Marhamat, o''tiring!'),

-- 1.10 Sifatlar (Adjectives) — 15
('好', 'hǎo', 'Yaxshi', 'Good', 1, '今天天气很好。', 'Bugun ob-havo juda yaxshi.'),
('大', 'dà', 'Katta', 'Big', 1, '这个苹果很大。', 'Bu olma juda katta.'),
('小', 'xiǎo', 'Kichik', 'Small', 1, '我有一个小猫。', 'Mening kichik mushugim bor.'),
('多', 'duō', 'Ko''p', 'Many / Much', 1, '这里人很多。', 'Bu yerda odamlar ko''p.'),
('少', 'shǎo', 'Oz / Kam', 'Few / Little', 1, '钱很少。', 'Pul juda oz.'),
('高', 'gāo', 'Baland / Uzun', 'Tall / High', 1, '他很高。', 'U juda baland bo''yli.'),
('长', 'cháng', 'Uzun', 'Long', 1, '这条路很长。', 'Bu yo''l juda uzun.'),
('热', 'rè', 'Issiq', 'Hot', 1, '今天很热。', 'Bugun juda issiq.'),
('冷', 'lěng', 'Sovuq', 'Cold', 1, '冬天很冷。', 'Qish juda sovuq.'),
('漂亮', 'piào liang', 'Chiroyli', 'Beautiful', 1, '她很漂亮。', 'U juda chiroyli.'),
('贵', 'guì', 'Qimmat', 'Expensive', 1, '这个很贵。', 'Bu juda qimmat.'),
('便宜', 'pián yi', 'Arzon', 'Cheap', 1, '这个很便宜。', 'Bu juda arzon.'),
('忙', 'máng', 'Band / Ovora', 'Busy', 1, '我今天很忙。', 'Men bugun juda bandman.'),
('累', 'lèi', 'Charchoq', 'Tired', 1, '我很累。', 'Men juda charchadim.'),
('高兴', 'gāo xìng', 'Xursand', 'Happy', 1, '很高兴见到你。', 'Sizni ko''rib xursandman.'),

-- 1.11 Ravishlar (Adverbs) — 6
('很', 'hěn', 'Juda', 'Very', 1, '今天很热。', 'Bugun juda issiq.'),
('也', 'yě', 'Ham', 'Also / Too', 1, '我也是学生。', 'Men ham talabaman.'),
('都', 'dōu', 'Hammasi', 'All / Both', 1, '我们都是学生。', 'Biz hammamiz talabamiz.'),
('太', 'tài', 'Haddan tashqari', 'Too / Overly', 1, '太贵了！', 'Juda qimmat!'),
('非常', 'fēi cháng', 'Nihoyatda', 'Extremely', 1, '我非常高兴。', 'Men nihoyatda xursandman.'),
('一起', 'yī qǐ', 'Birga', 'Together', 1, '我们一起去。', 'Biz birga boramiz.'),

-- 1.12 Transport — 4
('汽车', 'qì chē', 'Mashina', 'Car', 1, '坐汽车去学校。', 'Mashinada maktabga boraman.'),
('出租车', 'chū zū chē', 'Taksi', 'Taxi', 1, '我坐出租车。', 'Men taksiga o''tiraman.'),
('飞机', 'fēi jī', 'Samolyot', 'Airplane', 1, '坐飞机去北京。', 'Samolyotda Pekinga boraman.'),
('火车', 'huǒ chē', 'Poyezd', 'Train', 1, '火车很快。', 'Poyezd juda tez.'),

-- 1.13 Narsalar (Objects) — 6
('书', 'shū', 'Kitob', 'Book', 1, '这本书很好。', 'Bu kitob juda yaxshi.'),
('电脑', 'diàn nǎo', 'Kompyuter', 'Computer', 1, '我用电脑工作。', 'Men kompyuterda ishlayman.'),
('手机', 'shǒu jī', 'Telefon', 'Mobile phone', 1, '我的手机在哪里？', 'Mening telefonim qayerda?'),
('电话', 'diàn huà', 'Telefon qo''ng''iroq', 'Phone/Call', 1, '请打电话。', 'Menga qo''ng''iroq qiling.'),
('钱', 'qián', 'Pul', 'Money', 1, '我没有钱。', 'Menda pul yo''q.'),
('衣服', 'yī fu', 'Kiyim', 'Clothes', 1, '这件衣服很漂亮。', 'Bu kiyim juda chiroyli.'),

-- 1.14 Tabiat (Nature) — 4
('天气', 'tiān qì', 'Ob-havo', 'Weather', 1, '今天天气怎么样？', 'Bugun ob-havo qanday?'),
('太阳', 'tài yáng', 'Quyosh', 'Sun', 1, '太阳出来了。', 'Quyosh chiqdi.'),
('下雨', 'xià yǔ', 'Yomg''ir yog''moq', 'To rain', 1, '今天下雨了。', 'Bugun yomg''ir yog''di.'),
('下雪', 'xià xuě', 'Qor yog''moq', 'To snow', 1, '冬天下雪。', 'Qishda qor yog''adi.'),

-- 1.15 Ranglar (Colors) — 3
('红', 'hóng', 'Qizil', 'Red', 1, '红苹果。', 'Qizil olma.'),
('白', 'bái', 'Oq', 'White', 1, '白衬衫。', 'Oq ko''ylak.'),
('黑', 'hēi', 'Qora', 'Black', 1, '黑猫。', 'Qora mushuk.'),

-- 1.16 Maxsus so''zlar (Special) — 9
('人', 'rén', 'Odam / Kishi', 'Person', 1, '他是好人。', 'U yaxshi odam.'),
('汉语', 'hàn yǔ', 'Xitoy tili', 'Chinese language', 1, '我学汉语。', 'Men xitoy tilini o''rganaman.'),
('中文', 'zhōng wén', 'Xitoy yozuvi/tili', 'Chinese', 1, '你会中文吗？', 'Xitoycha bilasizmi?'),
('英语', 'yīng yǔ', 'Ingliz tili', 'English', 1, '我会英语。', 'Men inglizcha bilaman.'),
('名字', 'míng zi', 'Ism', 'Name', 1, '你叫什么名字？', 'Sening isming nima?'),
('岁', 'suì', 'Yosh (san)', 'Years old', 1, '我二十岁。', 'Men yigirma yoshdaman.'),
('个', 'gè', '(sanash birlik)', 'Measure word', 1, '三个人。', 'Uch kishi.');
