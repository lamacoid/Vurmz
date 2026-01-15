"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-10 animate-fade-in">
      <div>
        <h1 className="text-4xl font-semibold text-apple-gray-600 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-lg text-apple-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
