import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollReveal } from "../components/ScrollReveal";
import { MagicInput } from "../components/MagicInput";
import { ProductResults } from "../components/ProductResults";
import { LoadingAnalysis } from "../components/LoadingAnalysis";
import SplitText from "../components/SplitText";
import { analyzeProduct } from "../../api";
import { AnalysisResponse } from "../../types";

export function Analysis() {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentInput, setCurrentInput] = useState("");
    const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleReset = () => {
        setShowAnalysis(false);
        setIsLoading(false);
        setAnalysisData(null);
        setCurrentInput("");
        setUploadedFile(null);
        setError(null);
    };

    const handleAnalyze = async (input: string, file?: File) => {
        setCurrentInput(input || (file ? file.name : ""));
        setUploadedFile(file || null);
        setIsLoading(true);
        setError(null);

        try {
            // Call the real backend API
            const data = await analyzeProduct(input, file);

            if (data.status !== "success") {
                throw new Error("Product data not found or identified as non-food item.");
            }

            setAnalysisData(data);
            setShowAnalysis(true);
        } catch (err) {
            console.error("Analysis error:", err);
            setError(err instanceof Error ? err.message : "Failed to analyze product");
            setShowAnalysis(true); // Show results view (which will display the error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10">
            <AnimatePresence mode="wait">
                {!showAnalysis && !isLoading && (
                    <motion.div
                        key="input-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]"
                    >
                        <div className="flex justify-start w-full sm:justify-center mb-6">
                            <SplitText
                                text="Hi User"
                                className="text-3xl md:text-5xl font-bold text-foreground pb-2 text-center"
                                delay={100}
                                duration={0.6}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                textAlign="center"
                            />
                        </div>
                        <ScrollReveal>
                            <p className="text-text-secondary max-w-xl mx-auto mb-10 text-xl sm:text-center">
                                Let’s uncover the foodie mystery in your hand!
                            </p>
                            <div className="min-h-[100px] w-full">
                            </div>
                            <p className="text-text-secondary max-w-xl mx-auto mb-5 text-lg sm:text-center">
                                How do you want to show it?
                            </p>

                            <div className="w-full">
                                <MagicInput onAnalyze={handleAnalyze} />
                            </div>
                            
                            <p className="text-text-secondary max-w-xl mx-auto my-10 text-lg text-center">
                                I’ll scan the risks for you and tell you if it’s worth eating, simple and stress-free
                            </p>
                            <div className="min-h-[50px]">

                            </div>
                            <p className="text-text-secondary max-w-xl opacity-70 mx-auto my-10 text-sm text-center">
                                ⚠️ I may make mistakes. Please double-check the label if needed.
                            </p>

                        </ScrollReveal>
                    </motion.div>
                )}

                {isLoading && (
                    <motion.div
                        key="loading-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <LoadingAnalysis />
                    </motion.div>
                )}

                {/* Error Section Removed - Handled in ProductResults */}

                {(showAnalysis || error) && !isLoading && (
                    <motion.div
                        key="analysis-result"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full"
                    >
                        <ProductResults
                            data={analysisData}
                            onCheckAnother={handleReset}
                            searchQuery={currentInput}
                            uploadedFile={uploadedFile}
                            error={error}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
