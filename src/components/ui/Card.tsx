"use client";

import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white rounded-apple-lg border border-apple-gray-200",
          "transition-all duration-300 ease-out",
          {
            "hover:shadow-apple-hover hover:border-apple-gray-300 hover:-translate-y-0.5":
              hover,
            "p-0": padding === "none",
            "p-4": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const AnimatedCard = motion(Card);
