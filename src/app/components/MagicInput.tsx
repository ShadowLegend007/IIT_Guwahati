import { Camera, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";

interface MagicInputProps {
  onAnalyze: (text: string) => void;
}

export function MagicInput({ onAnalyze }: MagicInputProps) {
  const [input, setInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 700);
      onAnalyze(input);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="relative flex items-center gap-3 p-4 md:p-5 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-200 shadow-sm hover:shadow-md">
            {/* Icons */}
            <button
              type="button"
              className="p-2.5 rounded-lg hover:bg-muted transition-colors duration-200 group/icon"
              aria-label="Scan with camera"
            >
              <Camera className="w-5 h-5 text-muted-foreground group-hover/icon:text-accent transition-colors duration-200" />
            </button>
            
            <button
              type="button"
              className="p-2.5 rounded-lg hover:bg-muted transition-colors duration-200 group/icon"
              aria-label="Paste ingredients"
            >
              <FileText className="w-5 h-5 text-muted-foreground group-hover/icon:text-accent transition-colors duration-200" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-border" />

            {/* Input field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Upload a food label or paste ingredients..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="relative p-2.5 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm overflow-hidden group/btn"
              aria-label="Analyze"
            >
              {/* Ripple effect */}
              {isClicked && (
                <span 
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: 'ripple 0.5s ease-out',
                  }}
                />
              )}
              
              {/* Arrow icon */}
              <ArrowRight className="w-5 h-5 text-white relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </form>

      {/* Helper text */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Try: "Maltitol, Whey Protein Isolate, Almonds, Cocoa Butter"
      </p>
    </div>
  );
}