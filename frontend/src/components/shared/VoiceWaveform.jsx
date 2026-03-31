import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const VoiceWaveform = ({ active = false, barCount = 20, className }) => {
  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-primary"
          animate={
            active
              ? {
                  height: [4, 8 + Math.random() * 20, 4],
                  opacity: [0.4, 1, 0.4],
                }
              : { height: 4, opacity: 0.2 }
          }
          transition={
            active
              ? {
                  duration: 0.4 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.05,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};
