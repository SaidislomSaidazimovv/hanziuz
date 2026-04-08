const characters = [
  { char: "你", x: "10%", y: "20%", size: "text-6xl", duration: "8s", delay: "0s" },
  { char: "好", x: "80%", y: "15%", size: "text-5xl", duration: "11s", delay: "2s" },
  { char: "学", x: "20%", y: "70%", size: "text-4xl", duration: "9s", delay: "4s" },
  { char: "中", x: "70%", y: "65%", size: "text-7xl", duration: "13s", delay: "1s" },
  { char: "文", x: "45%", y: "80%", size: "text-5xl", duration: "10s", delay: "3s" },
  { char: "爱", x: "90%", y: "45%", size: "text-4xl", duration: "12s", delay: "5s" },
  { char: "书", x: "5%", y: "50%", size: "text-5xl", duration: "8s", delay: "1.5s" },
  { char: "话", x: "55%", y: "10%", size: "text-4xl", duration: "11s", delay: "3.5s" },
  { char: "国", x: "35%", y: "40%", size: "text-6xl", duration: "9s", delay: "0.5s" },
];

export default function FloatingCharacters() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {characters.map((item) => (
        <span
          key={item.char}
          className={`absolute font-chinese ${item.size} text-primary/[0.06] dark:text-primary/[0.08] floating-char`}
          style={{
            left: item.x,
            top: item.y,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
