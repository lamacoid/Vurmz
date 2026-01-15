"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-apple-gray-600 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-4 py-3 rounded-xl",
            "bg-apple-gray-100 border border-transparent",
            "text-apple-gray-600 placeholder-apple-gray-400",
            "transition-all duration-200 ease-out",
            "hover:border-apple-gray-300",
            "focus:bg-white focus:border-apple-blue focus:ring-0",
            "outline-none",
            {
              "border-apple-red focus:border-apple-red": error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-apple-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
