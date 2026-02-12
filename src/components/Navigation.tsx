"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Flame, Sparkles, Carrot, BookOpen } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Brainstorm",
    icon: Sparkles,
  },
  {
    href: "/ingredients",
    label: "Pantry",
    icon: Carrot,
  },
  {
    href: "/dishes",
    label: "Recipes",
    icon: BookOpen,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-warm-50/80 backdrop-blur-xl border-b border-warm-200/50" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-orange flex items-center justify-center shadow-glow-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Flame className="w-5 h-5 text-white" />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-9 h-9 rounded-xl bg-gradient-orange opacity-40 blur-lg -z-10" />
            </div>
            <span className="text-xl font-bold text-warm-800 tracking-tight">
              Vurmz
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1 bg-warm-100/50 rounded-full p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "text-sm font-medium transition-all duration-200",
                    {
                      "bg-white text-warm-800 shadow-soft-sm": isActive,
                      "text-warm-500 hover:text-warm-700": !isActive,
                    }
                  )}
                >
                  <Icon className={clsx("w-4 h-4", {
                    "text-accent-orange": isActive,
                  })} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
