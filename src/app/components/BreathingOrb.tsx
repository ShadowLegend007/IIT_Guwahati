import { motion } from "motion/react";

export function BreathingOrb() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
      {/* Main orb */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/10 border border-accent/20"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
      />
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent blur-2xl opacity-20 dark:opacity-10"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
      />

      {/* Inner orb */}
      <motion.div
        className="absolute inset-8 md:inset-12 rounded-full bg-accent/5 border border-accent/10"
        animate={{
          scale: [1, 0.95, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
