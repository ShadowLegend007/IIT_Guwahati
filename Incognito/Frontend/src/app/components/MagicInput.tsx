import { Search, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "motion/react";

interface MagicInputProps {
  onAnalyze: (text: string, file?: File) => void;
}

export function MagicInput({ onAnalyze }: MagicInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchMode, setSearchMode] = useState<"name" | "picture">("name");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
      setInput("");
    }
  };

  const handleFileSelect = (file: File) => {
    onAnalyze(file.name, file);
    setInput("");
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handlePictureMode = () => {
    setSearchMode("picture");
  };

  return (
    <>
      <div className="w-full relative flex flex-col items-center max-w-3xl mx-auto">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchMode("name")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base transition-all duration-300 ${searchMode === "name"
              ? "bg-accent text-white shadow-lg"
              : "bg-card/60 backdrop-blur-xl border-2 border-border/40 text-foreground hover:border-accent/30"
              }`}
          >
            <Search className="w-5 h-5" />
            Search by Name
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePictureMode}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base transition-all duration-300 ${searchMode === "picture"
              ? "bg-accent text-white shadow-lg"
              : "bg-card/60 backdrop-blur-xl border-2 border-border/40 text-foreground hover:border-accent/30"
              }`}
          >
            <ImageIcon className="w-5 h-5" />
            Search by Picture
          </motion.button>
        </div>

        {/* Input Section */}
        <div className="w-full">
          {searchMode === "name" ? (
            // Text Search Mode
            <form onSubmit={handleSubmit} className="w-full relative">
              <div className="flex flex-col gap-2">
                <label className="text-base font-bold text-foreground">
                  Product Name
                </label>
                <div className="flex gap-2">
                  <motion.div
                    layout
                    className={`
                      relative flex items-center flex-1
                      rounded-xl
                      transition-all duration-300 ease-out
                      backdrop-blur-xl
                      ${isFocused
                        ? "bg-card/80 border-accent/40 shadow-xl ring-2 ring-accent/20"
                        : "bg-card/60 hover:bg-card/70 border-border/50 shadow-lg hover:shadow-xl"
                      }
                      border-2
                    `}
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Enter a product name (e.g., Doritos, Oreo, Coke)"
                      className="w-full bg-transparent border-none text-foreground text-base px-5 py-4 focus:outline-none placeholder:text-muted-foreground/60"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim()}
                    className="px-8 py-4 bg-accent text-white rounded-xl font-bold text-base hover:bg-accent/90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Analyze
                  </motion.button>
                </div>
              </div>
            </form>
          ) : (
            // Picture Search Mode
            <div className="w-full">
              <label className="text-base font-bold text-foreground mb-3 block">
                Upload Product Image
              </label>
              <div className="w-full">
                {/* File Upload Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFileUpload}
                  className="h-[200px] md:h-[280px] w-full flex flex-col items-center justify-center gap-3 p-6 bg-card/60 hover:bg-card/80 border-2 border-border/50 hover:border-accent/30 rounded-xl transition-all duration-300 backdrop-blur-xl"
                >
                  <div className="p-4 bg-accent/10 rounded-full">
                    <Upload className="w-10 h-10 text-accent" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-base text-foreground">Upload File</div>
                    <div className="text-sm text-muted-foreground">Choose from device</div>
                  </div>
                </motion.button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
