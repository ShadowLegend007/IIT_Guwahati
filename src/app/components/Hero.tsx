import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { BreathingOrb } from "./BreathingOrb";
import { AnimatedButton } from "./AnimatedButton";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 glow-combined opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16"
      >
        <BreathingOrb />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          <span className="gradient-text">Interpret Ingredients.</span>{" "}
          <span className="text-foreground">Instantly.</span>
        </h1>

        <p className="mb-10 md:mb-12 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          An AI-native co-pilot that reads labels so you don't have to.{" "}
          <span className="text-foreground font-medium">No forms, just insight.</span>
        </p>

        <AnimatedButton onClick={onGetStarted} icon={ArrowRight}>
          Try the Co-Pilot
        </AnimatedButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-pill border border-border-glass flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}