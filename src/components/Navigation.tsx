"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Brainstorm",
    icon: Sparkles,
  },
  {
    href: "/ingredients",
    label: "Ingredients",
    icon: UtensilsCrossed,
  },
  {
    href: "/dishes",
    label: "My Dishes",
    icon: ChefHat,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-apple-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-apple-gray-600 tracking-tight">
              Vurmz
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
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
                      "bg-apple-gray-100 text-apple-gray-600": isActive,
                      "text-apple-gray-400 hover:text-apple-gray-600 hover:bg-apple-gray-50":
                        !isActive,
                    }
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
