"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          {
            // Variants
            "bg-apple-blue text-white hover:bg-blue-600 shadow-sm hover:shadow-md":
              variant === "primary",
            "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200":
              variant === "secondary",
            "bg-transparent text-apple-gray-500 hover:text-apple-gray-600 hover:bg-apple-gray-100":
              variant === "ghost",
            "bg-apple-red text-white hover:bg-red-600": variant === "danger",

            // Sizes
            "text-sm px-3 py-1.5 rounded-lg": size === "sm",
            "text-base px-5 py-2.5 rounded-xl": size === "md",
            "text-lg px-8 py-3.5 rounded-2xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
