-- 014: Seed HSK 3 Vocabulary — 68 words across 9 topics
-- Source: HSK3_sozlar_va_darslar.docx

DELETE FROM public.vocabulary WHERE hsk_level = 3;

INSERT INTO public.vocabulary (hanzi, pinyin, meaning_uz, meaning_en, hsk_level, example_sentence_zh, example_sentence_uz) VALUES
-- Mavzu 1: Ta'lim va Bilim (7)
('作业',   'zuò yè',    'Uy vazifasi',             'Homework',            3, '你做完作业了吗？',       'Uy vazifangizni bajardingizmi?'),
('复习',   'fù xí',     'Takrorlamoq',             'To review',           3, '我在复习汉语。',         'Men xitoy tilini takrorlamoqdaman.'),
('练习',   'liàn xí',   'Mashq qilmoq',            'To practice',         3, '每天练习很重要。',       'Har kuni mashq qilish juda muhim.'),
('考试',   'kǎo shì',   'Imtihon',                 'Exam',                3, '明天我有考试。',         'Ertaga mening imtihonim bor.'),
('成绩',   'chéng jì',  'Natija / Baho',           'Result / Grade',      3, '他的成绩很好。',         'Uning baholari juda yaxshi.'),
('毕业',   'bì yè',     'Bitirmoq',                'To graduate',         3, '他大学毕业了。',         'U universitetni bitirdi.'),
('班',     'bān',       'Sinf / Guruh',            'Class / Group',       3, '我们班有三十个学生。',   'Bizning sinfimizda 30 ta o''quvchi bor.'),

-- Mavzu 2: Ish va Kasb (7)
('工作',   'gōng zuò',  'Ish / Ishlamoq',          'Work / To work',      3, '我在银行工作。',         'Men bankda ishlayman.'),
('公司',   'gōng sī',   'Kompaniya',               'Company',             3, '他在大公司工作。',       'U katta kompaniyada ishlaydi.'),
('经理',   'jīng lǐ',   'Menejer / Direktor',      'Manager',             3, '她是我们的经理。',       'U bizning menejerimiz.'),
('工资',   'gōng zī',   'Maosh',                   'Salary',              3, '这个工作工资很高。',     'Bu ishning maoshi juda yuqori.'),
('会议',   'huì yì',    'Yig''ilish / Majlis',     'Meeting',             3, '下午有一个会议。',       'Tushdan keyin yig''ilish bor.'),
('合同',   'hé tong',   'Shartnoma',               'Contract',            3, '我们签了合同。',         'Biz shartnoma imzoladik.'),
('银行',   'yín háng',  'Bank',                    'Bank',                3, '银行几点开门？',         'Bank soat nechada ochiladi?'),

-- Mavzu 3: Tabiat va Ob-havo (9)
('天气',   'tiān qì',   'Ob-havo',                 'Weather',             3, '今天天气怎么样？',       'Bugungi ob-havo qanday?'),
('下雨',   'xià yǔ',    'Yomg''ir yog''moq',       'To rain',             3, '外面在下雨。',           'Tashqarida yomg''ir yog''moqda.'),
('下雪',   'xià xuě',   'Qor yog''moq',            'To snow',             3, '冬天这里下雪。',         'Qishda bu yerda qor yog''adi.'),
('季节',   'jì jié',    'Fasl',                    'Season',              3, '你喜欢哪个季节？',       'Qaysi faslni yoqtirasiz?'),
('春天',   'chūn tiān', 'Bahor',                   'Spring',              3, '春天花开了。',           'Bahorda gullar ochildi.'),
('夏天',   'xià tiān',  'Yoz',                     'Summer',              3, '夏天很热。',             'Yozda juda issiq bo''ladi.'),
('秋天',   'qiū tiān',  'Kuz',                     'Autumn',              3, '秋天树叶变红了。',       'Kuzda barglar qizarib ketdi.'),
('冬天',   'dōng tiān', 'Qish',                    'Winter',              3, '冬天我喜欢滑雪。',       'Qishda chang''i uchishni yoqtiraman.'),
('风',     'fēng',      'Shamol',                  'Wind',                3, '今天风很大。',           'Bugun shamol juda kuchli.'),

-- Mavzu 4: Ovqat va Restoran (8)
('米饭',   'mǐ fàn',    'Guruch / Plov',           'Rice',                3, '我喜欢吃米饭。',         'Men guruch yeyishni yoqtiraman.'),
('面条',   'miàn tiáo', 'Makaron / Lagmon',        'Noodles',             3, '来一碗面条。',           'Bir kosa lagmon bering.'),
('蔬菜',   'shū cài',   'Sabzavotlar',             'Vegetables',          3, '多吃蔬菜对身体好。',     'Ko''proq sabzavot yeyish sog''liq uchun yaxshi.'),
('水果',   'shuǐ guǒ',  'Mevalar',                 'Fruits',              3, '我每天吃水果。',         'Men har kuni meva yeyman.'),
('鸡',     'jī',        'Tovuq',                   'Chicken',             3, '烤鸡很好吃。',           'Qovurilgan tovuq juda mazali.'),
('鱼',     'yú',        'Baliq',                   'Fish',                3, '我不喜欢吃鱼。',         'Men baliq yeyishni yoqtirmayman.'),
('点菜',   'diǎn cài',  'Taom buyurtma qilmoq',    'To order food',       3, '服务员，我想点菜。',     'Ofitsiant, taom buyurtma qilmoqchiman.'),
('味道',   'wèi dào',   'Ta''m / Hid',             'Taste / Flavor',      3, '这个菜味道很好。',       'Bu taomning ta''mi juda yaxshi.'),

-- Mavzu 5: His-Tuyg'ular (7)
('高兴',   'gāo xìng',  'Xursand',                 'Happy / Glad',        3, '见到你很高兴！',         'Sizni ko''rganimdan juda xursandman!'),
('难过',   'nán guò',   'Xafa',                    'Sad',                 3, '他听到坏消息很难过。',   'U yomon xabarni eshitib, xafa bo''ldi.'),
('担心',   'dān xīn',   'Tashvishlantirmoq',       'To worry',            3, '妈妈很担心我。',         'Onam men haqimda juda tashvishlanadi.'),
('生气',   'shēng qì',  'Jahl qilmoq',             'To be angry',         3, '不要生气！',             'Jahlingizni chiqarmang!'),
('喜欢',   'xǐ huān',   'Yoqtirmoq',               'To like',             3, '我喜欢学中文。',         'Men xitoy tilini o''rganishni yoqtiraman.'),
('爱',     'ài',        'Sevmoq',                  'To love',             3, '我爱我的家人。',         'Men oilamni sevaman.'),
('羡慕',   'xiàn mù',   'Havas qilmoq',            'To envy',             3, '我羡慕他的生活。',       'Men uning hayotiga havas qilaman.'),

-- Mavzu 6: Muloqot va Fikr (7)
('同意',   'tóng yì',   'Rozi bo''lmoq',           'To agree',            3, '我同意你的看法。',       'Men sizning fikringizga roziman.'),
('反对',   'fǎn duì',   'Qarshi bo''lmoq',         'To oppose',           3, '他反对这个计划。',       'U bu rejaga qarshi.'),
('建议',   'jiàn yì',   'Taklif / Maslahat',       'Suggestion',          3, '我有一个建议。',         'Menda bir taklif bor.'),
('请问',   'qǐng wèn',  'Uzr, so''rasam',          'Excuse me / May I ask', 3, '请问，图书馆在哪里？', 'Uzr, kutubxona qayerda?'),
('回答',   'huí dá',    'Javob bermoq',            'To answer',           3, '请回答我的问题。',       'Iltimos, mening savolimga javob bering.'),
('问题',   'wèn tí',    'Savol / Muammo',          'Question / Problem',  3, '我有一个问题。',         'Menda bitta savol bor.'),
('解释',   'jiě shì',   'Tushuntirmoq',            'To explain',          3, '请你解释一下。',         'Iltimos, tushuntirib bering.'),

-- Mavzu 7: Shahar va Joy (7)
('城市',   'chéng shì', 'Shahar',                  'City',                3, '我住在大城市。',         'Men katta shaharda yashayman.'),
('农村',   'nóng cūn',  'Qishloq',                 'Rural area / Village', 3, '他来自农村。',          'U qishloqdan kelgan.'),
('超市',   'chāo shì',  'Supermarket',             'Supermarket',         3, '我去超市买东西。',       'Men supermarketga narsalar sotib olishga boraman.'),
('图书馆', 'tú shū guǎn', 'Kutubxona',             'Library',             3, '我们去图书馆学习吧。',   'Kutubxonaga o''qishga boraylik.'),
('公园',   'gōng yuán', 'Park',                    'Park',                3, '周末我在公园散步。',     'Dam olish kunlari parkda sayr qilaman.'),
('邮局',   'yóu jú',    'Pochta',                  'Post office',         3, '邮局在哪里？',           'Pochta qayerda?'),
('地铁',   'dì tiě',    'Metro',                   'Subway / Metro',      3, '我坐地铁去上班。',       'Men metroda ishga boraman.'),

-- Mavzu 8: Texnologiya (6)
('手机',   'shǒu jī',   'Telefon (Mobil)',         'Mobile phone',        3, '我的手机没电了。',       'Telefonim quvvati tugadi.'),
('电脑',   'diàn nǎo',  'Kompyuter',               'Computer',            3, '我用电脑工作。',         'Men kompyuterda ishlayman.'),
('网络',   'wǎng luò',  'Internet',                'Internet / Network',  3, '这里有网络吗？',         'Bu yerda internet bormi?'),
('发送',   'fā sòng',   'Yubormoq',                'To send',             3, '我给你发送信息。',       'Sizga xabar yuboraman.'),
('照片',   'zhào piàn', 'Rasm / Surat',            'Photo',               3, '我们一起拍照片吧！',     'Keling, birga rasm olaylik!'),
('联系',   'lián xì',   'Bog''lanmoq',             'To contact',          3, '请跟我联系。',           'Iltimos, men bilan bog''laning.'),

-- Mavzu 9: Grammatik So'zlar (10)
('虽然...但是', 'suī rán...dàn shì', 'Garchi...lekin',    'Although...but',     3, '虽然难，但是有趣。',           'Garchi qiyin bo''lsa ham, lekin qiziqarli.'),
('如果...就',   'rú guǒ...jiù',      'Agar...unda',       'If...then',          3, '如果下雨，我就不去。',         'Agar yomg''ir yog''sa, bormayman.'),
('不但...而且', 'bù dàn...ér qiě',   'Nafaqat...balki',   'Not only...but also', 3, '他不但聪明，而且勤劳。',       'U nafaqat aqlli, balki mehnatkash ham.'),
('一边...一边', 'yì biān...yì biān', '...qilib, ...qilmoq', 'While doing...',    3, '他一边吃饭一边看电视。',       'U ovqat yeyayotib televizor ko''rdi.'),
('对',         'duì',               'To''g''ri / Nisbatan', 'Correct / Towards', 3, '你说得对。',                   'Siz to''g''ri aytdingiz.'),
('只有...才',   'zhǐ yǒu...cái',     'Faqat...bo''lsa',    'Only if...then',     3, '只有努力才能成功。',           'Faqat mehnat qilsang muvaffaqiyatga erishasiz.'),
('一直',       'yì zhí',            'Doimo / To''xtovsiz', 'Always / Continuously', 3, '我一直在等你。',            'Men sizni doim kutyapman.'),
('已经',       'yǐ jīng',           'Allaqachon',         'Already',            3, '我已经吃过饭了。',             'Men allaqachon ovqatlandim.'),
('还',         'hái',               'Hali ham / Yana',    'Still / Also',       3, '你还在学习吗？',               'Hali ham o''qiyapsizmi?'),
('先...然后',   'xiān...rán hòu',    'Avval...keyin',      'First...then',       3, '先复习，然后做作业。',         'Avval takrorla, keyin uy vazifasini bajar.');
