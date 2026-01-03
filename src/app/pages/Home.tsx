import { Hero } from "../components/Hero";
import { FeatureGrid } from "../components/FeatureGrid";
import { ScrollReveal } from "../components/ScrollReveal";
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/analysis");
    };

    return (
        <>
            <ScrollReveal>
                <Hero onGetStarted={handleGetStarted} />
            </ScrollReveal>

            <section className="py-20 bg-black/20">
                <ScrollReveal>
                    <FeatureGrid />
                </ScrollReveal>
            </section>

            <footer className="py-8 border-t border-white/5 glass-card mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2025 NeuraGlance. AI insight for safer choices.
                </div>
            </footer>
        </>
    );
}
