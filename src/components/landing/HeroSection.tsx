import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingCharacters from "./FloatingCharacters";
import Link from "next/link";

const stats = [
  { value: "5,000+", label: "So'zlar" },
  { value: "HSK 1-6", label: "Darajalar" },
  { value: "AI", label: "Repetitor" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <FloatingCharacters />

      {/* Gradient orbs — hidden on mobile to save paint cost */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-2xl" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            O&apos;zbekistonda birinchi xitoy tili platformasi
          </div>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Xitoy tilini{" "}
          <span className="text-primary">o&apos;zbek tilida</span>{" "}
          o&apos;rganing
        </h1>

        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          AI repetitor, SRS kartochkalar va interaktiv darslar bilan HSK 1 dan 6
          gacha — barchasi o&apos;zbek tilida.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl shadow-lg shadow-primary/25"
            render={<Link href="/register" />}
          >
            Bepul boshlash
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl"
            render={<Link href="#features" />}
          >
            Batafsil
          </Button>
        </div>

        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
