import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Aloqa — HanziUz",
  description: "HanziUz jamoasi bilan bog'laning",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Aloqa</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Savollaringiz, takliflaringiz yoki hamkorlik bo&apos;yicha biz bilan
          bog&apos;laning
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Bog&apos;lanish usullari</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@hanziuz.uz
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Telegram</h3>
                <p className="text-sm text-muted-foreground">@hanziuz</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Manzil</h3>
                <p className="text-sm text-muted-foreground">
                  Toshkent, O&apos;zbekiston
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">Xabar yuborish</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium mb-1.5"
              >
                Ismingiz
              </label>
              <Input
                id="contact-name"
                type="text"
                placeholder="Ismingizni kiriting"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium mb-1.5"
              >
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="sizning@email.uz"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium mb-1.5"
              >
                Xabar
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Xabaringizni yozing..."
                className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11"
            >
              <Send className="w-4 h-4 mr-2" />
              Yuborish
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Biz 24 soat ichida javob beramiz
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
