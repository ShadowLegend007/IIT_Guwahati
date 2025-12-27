import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  icon: Icon,
  variant = "primary",
  type = "button",
  disabled = false,
  className = ""
}: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    if (onClick) {
      onClick();
    }
  };

  const baseStyles = "relative inline-flex items-center gap-2 px-6 py-3 rounded-pill font-medium transition-all duration-300 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed";

  const variantStyles = variant === "primary"
    ? "gradient-bg text-white shadow-lg glow-purple hover:shadow-xl hover:scale-105 active:scale-95"
    : "glass-card border border-border-glass text-accent hover:border-accent/50 hover:glow-purple active:scale-95";

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className} group`}
    >
      {/* Ripple effect */}
      {isClicked && (
        <span
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'ripple 0.6s ease-out',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        {Icon && <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
    </button>
  );
}
