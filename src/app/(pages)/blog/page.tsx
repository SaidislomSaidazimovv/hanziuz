import { FileText, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog — HanziUz",
  description: "Xitoy tili va madaniyati haqida maqolalar",
};

const posts = [
  {
    title: "Xitoy tilini o'rganishni boshlash uchun 5 maslahat",
    excerpt:
      "Xitoy tili dunyodagi eng qiyin tillardan biri deb hisoblanadi. Lekin to'g'ri yondashuv bilan uni o'rganish mumkin.",
    date: "2026-04-01",
    category: "Maslahatlar",
    readTime: "5 daqiqa",
  },
  {
    title: "HSK 1 imtihoniga qanday tayyorlanish kerak?",
    excerpt:
      "HSK 1 — bu xitoy tili bo'yicha eng boshlang'ich daraja. Bu maqolada imtihonga tayyorlanish strategiyasini ko'rib chiqamiz.",
    date: "2026-03-25",
    category: "HSK",
    readTime: "7 daqiqa",
  },
  {
    title: "Ierogliflarni tez yodlashning 3 ta usuli",
    excerpt:
      "Xitoy ierogliflari murakkab ko'rinadi, lekin ularni yodlashning samarali usullari mavjud.",
    date: "2026-03-18",
    category: "O'rganish",
    readTime: "4 daqiqa",
  },
  {
    title: "O'zbekiston-Xitoy savdo aloqalari va til bilish ahamiyati",
    excerpt:
      "O'zbekiston va Xitoy o'rtasidagi savdo hajmi yildan-yilga o'smoqda. Xitoy tilini bilish katta afzallik beradi.",
    date: "2026-03-10",
    category: "Karyera",
    readTime: "6 daqiqa",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Xitoy tili va madaniyati haqida foydali maqolalar
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString("uz-UZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {post.readTime}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            <p className="text-sm text-primary font-medium mt-3">
              Tez kunda to&apos;liq maqola...
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
