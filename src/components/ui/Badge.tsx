"use client";

import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "info";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        "transition-colors duration-200",
        {
          "bg-apple-gray-100 text-apple-gray-500": variant === "default",
          "bg-green-100 text-green-700": variant === "success",
          "bg-orange-100 text-orange-700": variant === "warning",
          "bg-blue-100 text-blue-700": variant === "info",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
