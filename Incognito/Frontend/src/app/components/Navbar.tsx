import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import SplitText from "./SplitText";

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto">
                {/* Glassmorphism pill-shaped container - Floating Water Glass Effect */}
                <div className="bg-transparent backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full px-6 py-3 shadow-none flex items-center justify-between relative overflow-hidden">
                    {/* Glossy sheen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 pointer-events-none rounded-full"></div>
                    {/* Logo with gradient text */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            <div onClick={() => window.location.reload()} className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
                                Incognito
                            </div>
                        </motion.div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
