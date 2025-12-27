import { useState, useRef } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { Hero } from "./components/Hero";
import { MagicInput } from "./components/MagicInput";
import { InsightCard } from "./components/InsightCard";
import { FeatureGrid } from "./components/FeatureGrid";
import { AnimatedButton } from "./components/AnimatedButton";
import { ArrowRight } from "lucide-react";

function App() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<{
    productName: string;
    confidence: "high" | "medium" | "low";
    mainInsight: string;
    reasoning: string;
    followUp: string;
    safetyScore: number;
    ingredientBreakdown: Array<{ name: string; value: number; color?: string }>;
    allergens: string[];
    keyTopics: string[];
    pros: string[];
    cons: string[];
    ageRecommendations: Array<{
      ageGroup: string;
      recommendation: "safe" | "caution" | "avoid";
      note?: string;
    }>;
  } | null>(null);

  const inputSectionRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = (input: string) => {
    // Mock analysis - in production, this would call an AI API
    const mockAnalysis = {
      productName: "Protein Bar",
      confidence: "high" as const,
      mainInsight: "Contains Maltitol. Safe, but may cause bloating.",
      reasoning: "Maltitol is a sugar alcohol commonly used as a low-calorie sweetener. While it's generally recognized as safe, consuming large amounts (typically over 10-15g) can cause digestive discomfort including bloating and gas. This occurs because maltitol is not fully absorbed in the small intestine and ferments in the colon.",
      followUp: "Is this safe for kids?",
      safetyScore: 75,
      ingredientBreakdown: [
        { name: "Protein", value: 35, color: "#7c3aed" },
        { name: "Carbohydrates", value: 30, color: "#8b5cf6" },
        { name: "Fats", value: 15, color: "#3b82f6" },
        { name: "Fiber", value: 12, color: "#60a5fa" },
        { name: "Other", value: 8, color: "#10b981" },
      ],
      allergens: ["Milk", "Soy", "Tree Nuts"],
      keyTopics: ["having", "trouble", "accessing", "google"],
      pros: [
        "High protein content (20g per bar)",
        "Low sugar compared to alternatives",
        "Good source of fiber",
        "Convenient on-the-go nutrition",
      ],
      cons: [
        "May cause digestive discomfort due to Maltitol",
        "Contains artificial sweeteners",
        "Higher calorie count than some alternatives",
        "Processed ingredients",
      ],
      ageRecommendations: [
        {
          ageGroup: "Adults",
          recommendation: "safe" as const,
          note: "Suitable for regular consumption",
        },
        {
          ageGroup: "Teens (13-17)",
          recommendation: "safe" as const,
          note: "Good protein source for active teens",
        },
        {
          ageGroup: "Children (6-12)",
          recommendation: "caution" as const,
          note: "Monitor portion size due to sugar alcohols",
        },
        {
          ageGroup: "Babies (0-2)",
          recommendation: "avoid" as const,
          note: "Not suitable for infants and toddlers",
        },
      ],
    };

    setAnalysisData(mockAnalysis);
    setShowAnalysis(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a
              href="#"
              className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity duration-200"
            >
              NeuraGlance
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} />

      {/* Interface Section */}
      <section ref={inputSectionRef} className="py-16 md:py-24 glass-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 font-bold gradient-text">
              Ingredient Analysis
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Enter a product name or ingredient list and our AI will analyze it for safety and provide insights
            </p>
          </div>

          <MagicInput onAnalyze={handleAnalyze} />

          {/* Analysis Results */}
          {showAnalysis && analysisData && (
            <InsightCard
              productName={analysisData.productName}
              confidence={analysisData.confidence}
              mainInsight={analysisData.mainInsight}
              reasoning={analysisData.reasoning}
              followUp={analysisData.followUp}
              safetyScore={analysisData.safetyScore}
              ingredientBreakdown={analysisData.ingredientBreakdown}
              allergens={analysisData.allergens}
              keyTopics={analysisData.keyTopics}
              pros={analysisData.pros}
              cons={analysisData.cons}
              ageRecommendations={analysisData.ageRecommendations}
            />
          )}

          {/* CTA after analysis */}
          {showAnalysis && (
            <div className="text-center mt-12">
              <AnimatedButton
                onClick={() => {
                  setShowAnalysis(false);
                  setAnalysisData(null);
                  window.scrollTo({ top: inputSectionRef.current?.offsetTop || 0, behavior: 'smooth' });
                }}
                icon={ArrowRight}
              >
                Analyze Another Product
              </AnimatedButton>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Footer */}
      <footer className="py-12 border-t border-border glass-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div
              className="text-2xl font-bold gradient-text mb-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              NeuraGlance
            </div>
            <p className="text-text-secondary mb-2">
              Turning ingredients into clear, actionable insights
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 NeuraGlance. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Not intended for medical advice. Always consult healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;