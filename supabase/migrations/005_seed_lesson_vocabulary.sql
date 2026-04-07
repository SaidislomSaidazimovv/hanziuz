-- 005: Link lessons to vocabulary words

DELETE FROM public.lesson_vocabulary;

-- HSK 1 Lesson 1: Salomlashish
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Salomlashish va tanishish' AND l.hsk_level = 1
  AND v.hanzi IN ('你好','再见','谢谢','对不起','没关系','请','是','不','的','吗');

-- HSK 1 Lesson 2: Olmoshlar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Olmoshlar: Men, Sen, U' AND l.hsk_level = 1
  AND v.hanzi IN ('我','你','他','她','我们','你们','他们','这','那','什么','谁','哪','哪里');

-- HSK 1 Lesson 3: Raqamlar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Raqamlar: 0 dan 10 gacha' AND l.hsk_level = 1
  AND v.hanzi IN ('零','一','二','三','四','五','六','七','八','九','十','百','千','万','两');

-- HSK 1 Lesson 4: Oila
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Oilaviy a''zolar' AND l.hsk_level = 1
  AND v.hanzi IN ('爸爸','妈妈','哥哥','姐姐','弟弟','妹妹','儿子','女儿');

-- HSK 1 Lesson 5: Sifatlar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Sifatlar: Katta, Kichik, Yaxshi' AND l.hsk_level = 1
  AND v.hanzi IN ('好','大','小','多','少','高','长','热','冷','漂亮','贵','便宜','忙','累','高兴');

-- HSK 1 Lesson 6: Kasblar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Kasblar: Talaba va O''qituvchi' AND l.hsk_level = 1
  AND v.hanzi IN ('学生','老师','医生','朋友');

-- HSK 1 Lesson 7: Vaqt
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Vaqt: Bugun, Ertaga, Kecha' AND l.hsk_level = 1
  AND v.hanzi IN ('年','月','日','今天','明天','昨天','上午','下午','晚上','时候','现在','点','分钟');

-- HSK 1 Lesson 8: Ovqatlanish
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ovqatlanish: Yemoq va Ichmoq' AND l.hsk_level = 1
  AND v.hanzi IN ('吃','喝','水','茶','咖啡','米饭','面条','苹果','鸡蛋','肉');

-- HSK 1 Lesson 9: Fe''llar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Asosiy fe''llar' AND l.hsk_level = 1
  AND v.hanzi IN ('来','去','有','没有','想','喜欢','知道','叫','住','学习','工作','休息','睡觉','起床','买','开','回','坐','看','听','说','读','写');

-- HSK 1 Lesson 10: Ob-havo
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ob-havo haqida suhbat' AND l.hsk_level = 1
  AND v.hanzi IN ('天气','太阳','下雨','下雪','热','冷');

-- HSK 1 Lesson 11: Manzil
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Manzil va joy' AND l.hsk_level = 1
  AND v.hanzi IN ('学校','家','中国','北京','饭店','商店','医院');

-- HSK 1 Lesson 12: Transport
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Transport vositalari' AND l.hsk_level = 1
  AND v.hanzi IN ('汽车','出租车','飞机','火车','坐');

-- HSK 1 Lesson 13: Xarid
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Do''konda xarid' AND l.hsk_level = 1
  AND v.hanzi IN ('买','钱','贵','便宜','商店','多','少');

-- HSK 1 Lesson 14: Ranglar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ranglar' AND l.hsk_level = 1
  AND v.hanzi IN ('红','白','黑','漂亮','衣服');

-- HSK 1 Lesson 15: Yakuniy takrorlash (all HSK1 vocab)
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'HSK 1 Yakuniy Takrorlash' AND l.hsk_level = 1
  AND v.hsk_level = 1
LIMIT 30;

-- HSK 2 Lesson 1: Kundalik muloqot
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Kundalik Muloqot va Iboralar' AND l.hsk_level = 2
  AND v.hanzi IN ('帮助','告诉','介绍','认识','问','希望','觉得','让');

-- HSK 2 Lesson 2: Maktab
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Maktab va Ta''lim' AND l.hsk_level = 2
  AND v.hanzi IN ('班','成绩','考试','练习','作业','难','容易','正确','错','懂');

-- HSK 2 Lesson 3: Vaqt ifodalash
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Vaqt ifodalash: Tez-tez, Ba''zan, Doimo' AND l.hsk_level = 2
  AND v.hanzi IN ('一般','常常','有时候','从来','已经','还','再','刚才','马上','一直','一下','先','别');

-- HSK 2 Lesson 4: Yo''nalish
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Yo''nalish va Manzil' AND l.hsk_level = 2
  AND v.hanzi IN ('左边','右边','前面','后面','中间','里面','上面','下面','旁边','附近','近','远','向');

-- HSK 2 Lesson 5: Transport
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Transport va Sayohat' AND l.hsk_level = 2
  AND v.hanzi IN ('地铁','公共汽车','自行车','机场','站','票','护照','行李','旅游','旅行','骑');

-- HSK 2 Lesson 6: Xarid
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Xarid qilish va Narx so''rash' AND l.hsk_level = 2
  AND v.hanzi IN ('超市','东西','价格','换','需要','新','旧','方便');

-- HSK 2 Lesson 7: Sport
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Sport va Faollik' AND l.hsk_level = 2
  AND v.hanzi IN ('运动','足球','游泳','跑','踢','跳舞','唱','玩','打','快','慢');

-- HSK 2 Lesson 8: Salomatlik
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Salomatlik va Kasalxona' AND l.hsk_level = 2
  AND v.hanzi IN ('生病','药','洗手间','刷牙','洗澡','胖','瘦','重','轻');

-- HSK 2 Lesson 9: Uy
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Uy va Xona' AND l.hsk_level = 2
  AND v.hanzi IN ('房间','桌子','椅子','镜子','空调','干净','脏','搬');

-- HSK 2 Lesson 10: Ob-havo va fasllar
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'Ob-havo va Fasllar' AND l.hsk_level = 2
  AND v.hanzi IN ('季节','春天','夏天','秋天','冬天','暖和','变','声音');

-- HSK 2 Lesson 11: His-tuyg''ular
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'His-tuyg''ular va Fikrlar' AND l.hsk_level = 2
  AND v.hanzi IN ('觉得','希望','喜欢','有趣','有名','当然','其实','所以','因为','但是','如果','虽然','或者','而且','然后');

-- HSK 2 Lesson 12: Yakuniy takrorlash (sample HSK2 vocab)
INSERT INTO public.lesson_vocabulary (lesson_id, vocab_id, order_num)
SELECT l.id, v.id, row_number() OVER (ORDER BY v.id)
FROM public.lessons l, public.vocabulary v
WHERE l.title_uz = 'HSK 2 Yakuniy Takrorlash' AND l.hsk_level = 2
  AND v.hsk_level = 2
LIMIT 30;
