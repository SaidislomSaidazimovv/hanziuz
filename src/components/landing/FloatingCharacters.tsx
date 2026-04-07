"use client";

import { motion } from "framer-motion";

const characters = [
  { char: "你", x: "10%", y: "20%", delay: 0, size: "text-6xl" },
  { char: "好", x: "80%", y: "15%", delay: 0.5, size: "text-5xl" },
  { char: "学", x: "20%", y: "70%", delay: 1, size: "text-4xl" },
  { char: "中", x: "70%", y: "65%", delay: 1.5, size: "text-7xl" },
  { char: "文", x: "45%", y: "80%", delay: 0.8, size: "text-5xl" },
  { char: "爱", x: "90%", y: "45%", delay: 1.2, size: "text-4xl" },
  { char: "书", x: "5%", y: "50%", delay: 0.3, size: "text-5xl" },
  { char: "话", x: "55%", y: "10%", delay: 1.8, size: "text-4xl" },
  { char: "国", x: "35%", y: "40%", delay: 0.6, size: "text-6xl" },
];

export default function FloatingCharacters() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {characters.map((item) => (
        <motion.span
          key={item.char}
          className={`absolute font-chinese ${item.size} text-primary/[0.06] dark:text-primary/[0.08]`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: item.delay },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </div>
  );
}
