import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vurmz — Restaurant Brainstorm",
  description: "Brainstorm delicious dishes with your ingredients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-warm-50 bg-gradient-mesh">
        {/* Subtle gradient orbs for depth */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-amber/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent-coral/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-accent-orange/10 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
