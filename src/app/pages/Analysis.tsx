import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollReveal } from "../components/ScrollReveal";
import { MagicInput } from "../components/MagicInput";
import { ProductResults } from "../components/ProductResults";
import { LoadingAnalysis } from "../components/LoadingAnalysis";
import SplitText from "../components/SplitText";
import sampleData from "../../data.json";

export function Analysis() {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentInput, setCurrentInput] = useState("");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleReset = () => {
        setShowAnalysis(false);
        setIsLoading(false);
        setAnalysisData(null);
        setCurrentInput("");
        setUploadedFile(null);
    };

    const handleAnalyze = (input: string, file?: File) => {
        setCurrentInput(input);
        setUploadedFile(file || null);
        setIsLoading(true);

        // Simulate backend processing time
        setTimeout(() => {
            // In a real app, this would be an API call
            // The backend would update data.json and we'd read from it
            setAnalysisData(sampleData);
            setIsLoading(false);
            setShowAnalysis(true);
        }, 2500); // 2.5 seconds to simulate AI analysis
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
                        <div className="flex justify-center mb-6">
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
                            <p className="text-text-secondary max-w-xl mx-auto mb-10 text-lg text-center">
                                Analyze any food product to understand its health impact
                            </p>

                            <div className="w-full">
                                <MagicInput onAnalyze={handleAnalyze} />
                            </div>
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

                {showAnalysis && !isLoading && (
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
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
