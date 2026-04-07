// HSK 1 Vocabulary — 30 most common words
export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningUz: string;
  meaningEn: string;
  hskLevel: number;
  exampleZh: string;
  exampleUz: string;
  audioUrl?: string;
}

export const hsk1Vocabulary: VocabWord[] = [
  { id: "v1", hanzi: "你好", pinyin: "nǐ hǎo", meaningUz: "Salom", meaningEn: "Hello", hskLevel: 1, exampleZh: "你好，我是李明。", exampleUz: "Salom, men Li Mingman." },
  { id: "v2", hanzi: "谢谢", pinyin: "xiè xie", meaningUz: "Rahmat", meaningEn: "Thank you", hskLevel: 1, exampleZh: "谢谢你的帮助。", exampleUz: "Yordamingiz uchun rahmat." },
  { id: "v3", hanzi: "再见", pinyin: "zài jiàn", meaningUz: "Xayr", meaningEn: "Goodbye", hskLevel: 1, exampleZh: "再见，明天见！", exampleUz: "Xayr, ertaga ko'rishamiz!" },
  { id: "v4", hanzi: "我", pinyin: "wǒ", meaningUz: "Men", meaningEn: "I / Me", hskLevel: 1, exampleZh: "我是学生。", exampleUz: "Men talabaman." },
  { id: "v5", hanzi: "你", pinyin: "nǐ", meaningUz: "Sen", meaningEn: "You", hskLevel: 1, exampleZh: "你叫什么名字？", exampleUz: "Sening isming nima?" },
  { id: "v6", hanzi: "他", pinyin: "tā", meaningUz: "U (erkak)", meaningEn: "He / Him", hskLevel: 1, exampleZh: "他是我的朋友。", exampleUz: "U mening do'stim." },
  { id: "v7", hanzi: "她", pinyin: "tā", meaningUz: "U (ayol)", meaningEn: "She / Her", hskLevel: 1, exampleZh: "她是老师。", exampleUz: "U o'qituvchi." },
  { id: "v8", hanzi: "是", pinyin: "shì", meaningUz: "...dir / bo'lmoq", meaningEn: "To be / Is", hskLevel: 1, exampleZh: "我是中国人。", exampleUz: "Men xitoylikman." },
  { id: "v9", hanzi: "不", pinyin: "bù", meaningUz: "Yo'q / emas", meaningEn: "Not / No", hskLevel: 1, exampleZh: "我不是医生。", exampleUz: "Men shifokor emasman." },
  { id: "v10", hanzi: "好", pinyin: "hǎo", meaningUz: "Yaxshi", meaningEn: "Good", hskLevel: 1, exampleZh: "今天天气很好。", exampleUz: "Bugun ob-havo juda yaxshi." },
  { id: "v11", hanzi: "人", pinyin: "rén", meaningUz: "Odam / Kishi", meaningEn: "Person", hskLevel: 1, exampleZh: "他是好人。", exampleUz: "U yaxshi odam." },
  { id: "v12", hanzi: "大", pinyin: "dà", meaningUz: "Katta", meaningEn: "Big", hskLevel: 1, exampleZh: "这个苹果很大。", exampleUz: "Bu olma juda katta." },
  { id: "v13", hanzi: "小", pinyin: "xiǎo", meaningUz: "Kichik", meaningEn: "Small", hskLevel: 1, exampleZh: "我有一个小猫。", exampleUz: "Mening kichik mushugim bor." },
  { id: "v14", hanzi: "一", pinyin: "yī", meaningUz: "Bir", meaningEn: "One", hskLevel: 1, exampleZh: "我有一本书。", exampleUz: "Mening bitta kitobim bor." },
  { id: "v15", hanzi: "二", pinyin: "èr", meaningUz: "Ikki", meaningEn: "Two", hskLevel: 1, exampleZh: "我有二个孩子。", exampleUz: "Mening ikkita farzandim bor." },
  { id: "v16", hanzi: "三", pinyin: "sān", meaningUz: "Uch", meaningEn: "Three", hskLevel: 1, exampleZh: "三个人来了。", exampleUz: "Uch kishi keldi." },
  { id: "v17", hanzi: "十", pinyin: "shí", meaningUz: "O'n", meaningEn: "Ten", hskLevel: 1, exampleZh: "我十岁了。", exampleUz: "Men o'n yoshdaman." },
  { id: "v18", hanzi: "中国", pinyin: "zhōng guó", meaningUz: "Xitoy", meaningEn: "China", hskLevel: 1, exampleZh: "我在中国学习。", exampleUz: "Men Xitoyda o'qiyapman." },
  { id: "v19", hanzi: "学生", pinyin: "xué shēng", meaningUz: "Talaba", meaningEn: "Student", hskLevel: 1, exampleZh: "我是学生。", exampleUz: "Men talabaman." },
  { id: "v20", hanzi: "老师", pinyin: "lǎo shī", meaningUz: "O'qituvchi", meaningEn: "Teacher", hskLevel: 1, exampleZh: "她是我的老师。", exampleUz: "U mening o'qituvchim." },
  { id: "v21", hanzi: "朋友", pinyin: "péng you", meaningUz: "Do'st", meaningEn: "Friend", hskLevel: 1, exampleZh: "他是我的好朋友。", exampleUz: "U mening yaxshi do'stim." },
  { id: "v22", hanzi: "水", pinyin: "shuǐ", meaningUz: "Suv", meaningEn: "Water", hskLevel: 1, exampleZh: "我想喝水。", exampleUz: "Men suv ichmoqchiman." },
  { id: "v23", hanzi: "吃", pinyin: "chī", meaningUz: "Yemoq", meaningEn: "To eat", hskLevel: 1, exampleZh: "我们吃饭吧。", exampleUz: "Keling, ovqat yeylik." },
  { id: "v24", hanzi: "喝", pinyin: "hē", meaningUz: "Ichmoq", meaningEn: "To drink", hskLevel: 1, exampleZh: "你想喝茶吗？", exampleUz: "Choy ichmoqchimisan?" },
  { id: "v25", hanzi: "看", pinyin: "kàn", meaningUz: "Qaramoq / Ko'rmoq", meaningEn: "To look / To see", hskLevel: 1, exampleZh: "我在看书。", exampleUz: "Men kitob o'qiyapman." },
  { id: "v26", hanzi: "听", pinyin: "tīng", meaningUz: "Tinglamoq", meaningEn: "To listen", hskLevel: 1, exampleZh: "我听音乐。", exampleUz: "Men musiqa tinglayman." },
  { id: "v27", hanzi: "说", pinyin: "shuō", meaningUz: "Gapirmoq", meaningEn: "To speak", hskLevel: 1, exampleZh: "你会说中文吗？", exampleUz: "Xitoycha gapira olasizmi?" },
  { id: "v28", hanzi: "读", pinyin: "dú", meaningUz: "O'qimoq", meaningEn: "To read", hskLevel: 1, exampleZh: "我在读课文。", exampleUz: "Men darslikni o'qiyapman." },
  { id: "v29", hanzi: "写", pinyin: "xiě", meaningUz: "Yozmoq", meaningEn: "To write", hskLevel: 1, exampleZh: "我会写汉字。", exampleUz: "Men ierogliflarni yoza olaman." },
  { id: "v30", hanzi: "很", pinyin: "hěn", meaningUz: "Juda", meaningEn: "Very", hskLevel: 1, exampleZh: "今天很热。", exampleUz: "Bugun juda issiq." },
];

// Lessons data
export interface Lesson {
  id: string;
  titleUz: string;
  titleZh: string;
  descriptionUz: string;
  hskLevel: number;
  orderNum: number;
  isFree: boolean;
  xpReward: number;
  vocabIds: string[];
  hanziPreview: string;
}

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    titleUz: "Salomlashish va tanishish",
    titleZh: "问好和介绍",
    descriptionUz: "Xitoy tilida salomlashish, xayrlashish va o'zingizni tanishtirish.",
    hskLevel: 1,
    orderNum: 1,
    isFree: true,
    xpReward: 20,
    vocabIds: ["v1", "v2", "v3", "v4", "v5"],
    hanziPreview: "你好",
  },
  {
    id: "lesson-2",
    titleUz: "Olmoshlar va 'bo'lmoq' fe'li",
    titleZh: "代词和是",
    descriptionUz: "Shaxs olmoshlari (men, sen, u) va '是' fe'lini o'rganing.",
    hskLevel: 1,
    orderNum: 2,
    isFree: true,
    xpReward: 20,
    vocabIds: ["v4", "v5", "v6", "v7", "v8", "v9"],
    hanziPreview: "我是",
  },
  {
    id: "lesson-3",
    titleUz: "Raqamlar va sanash",
    titleZh: "数字",
    descriptionUz: "Xitoy tilida 1 dan 10 gacha sanashni o'rganing.",
    hskLevel: 1,
    orderNum: 3,
    isFree: true,
    xpReward: 25,
    vocabIds: ["v14", "v15", "v16", "v17"],
    hanziPreview: "一二三",
  },
  {
    id: "lesson-4",
    titleUz: "Sifatlar: katta va kichik",
    titleZh: "形容词：大和小",
    descriptionUz: "Asosiy sifatlar va 'hěn' (juda) so'zini ishlatish.",
    hskLevel: 1,
    orderNum: 4,
    isFree: true,
    xpReward: 20,
    vocabIds: ["v10", "v11", "v12", "v13", "v30"],
    hanziPreview: "大小",
  },
  {
    id: "lesson-5",
    titleUz: "Kasblar: talaba va o'qituvchi",
    titleZh: "职业：学生和老师",
    descriptionUz: "Kasblar haqida gapirish va savol berish.",
    hskLevel: 1,
    orderNum: 5,
    isFree: true,
    xpReward: 25,
    vocabIds: ["v18", "v19", "v20", "v21"],
    hanziPreview: "学生",
  },
  {
    id: "lesson-6",
    titleUz: "Ovqatlanish: yemoq va ichmoq",
    titleZh: "吃和喝",
    descriptionUz: "Ovqat va ichimliklar haqida so'zlashish.",
    hskLevel: 1,
    orderNum: 6,
    isFree: false,
    xpReward: 25,
    vocabIds: ["v22", "v23", "v24"],
    hanziPreview: "吃喝",
  },
  {
    id: "lesson-7",
    titleUz: "Kundalik fe'llar",
    titleZh: "日常动词",
    descriptionUz: "Ko'rmoq, tinglamoq, gapirmoq, o'qimoq, yozmoq.",
    hskLevel: 1,
    orderNum: 7,
    isFree: false,
    xpReward: 30,
    vocabIds: ["v25", "v26", "v27", "v28", "v29"],
    hanziPreview: "看听说",
  },
  {
    id: "lesson-8",
    titleUz: "Xitoy haqida suhbat",
    titleZh: "谈谈中国",
    descriptionUz: "Xitoy, til va madaniyat haqida oddiy suhbat.",
    hskLevel: 1,
    orderNum: 8,
    isFree: false,
    xpReward: 30,
    vocabIds: ["v18", "v27", "v8", "v10", "v11"],
    hanziPreview: "中国",
  },
  // HSK 2 placeholder lessons
  {
    id: "lesson-9",
    titleUz: "Vaqt va kun tartibi",
    titleZh: "时间和日程",
    descriptionUz: "Soat, kun va hafta kunlarini o'rganing.",
    hskLevel: 2,
    orderNum: 1,
    isFree: false,
    xpReward: 30,
    vocabIds: [],
    hanziPreview: "时间",
  },
  {
    id: "lesson-10",
    titleUz: "Transport va sayohat",
    titleZh: "交通和旅行",
    descriptionUz: "Transport vositalari va yo'nalishlar haqida.",
    hskLevel: 2,
    orderNum: 2,
    isFree: false,
    xpReward: 30,
    vocabIds: [],
    hanziPreview: "旅行",
  },
  {
    id: "lesson-11",
    titleUz: "Do'konda xarid qilish",
    titleZh: "在商店购物",
    descriptionUz: "Narx so'rash, xarid qilish va to'lash.",
    hskLevel: 2,
    orderNum: 3,
    isFree: false,
    xpReward: 35,
    vocabIds: [],
    hanziPreview: "买卖",
  },
];

// Mock user progress
export interface UserLessonProgress {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number; // 0-100
  score?: number;
}

export const mockProgress: UserLessonProgress[] = [
  { lessonId: "lesson-1", status: "completed", progress: 100, score: 95 },
  { lessonId: "lesson-2", status: "completed", progress: 100, score: 88 },
  { lessonId: "lesson-3", status: "in_progress", progress: 65 },
  { lessonId: "lesson-4", status: "not_started", progress: 0 },
  { lessonId: "lesson-5", status: "not_started", progress: 0 },
  { lessonId: "lesson-6", status: "not_started", progress: 0 },
  { lessonId: "lesson-7", status: "not_started", progress: 0 },
  { lessonId: "lesson-8", status: "not_started", progress: 0 },
  { lessonId: "lesson-9", status: "not_started", progress: 0 },
  { lessonId: "lesson-10", status: "not_started", progress: 0 },
  { lessonId: "lesson-11", status: "not_started", progress: 0 },
];
