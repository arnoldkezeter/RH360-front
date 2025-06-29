import { cn } from "../../../fonctions/fonction";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      ghost: "text-gray-700 hover:bg-gray-100",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
