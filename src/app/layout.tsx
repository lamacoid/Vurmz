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
      <body className="min-h-screen bg-apple-gray-50">
        {children}
      </body>
    </html>
  );
}
