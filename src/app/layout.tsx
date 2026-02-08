import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopLab - DeFi Loop Strategy Analyzer",
  description: "Model, optimize and compare DeFi lending/borrowing loop strategies with rigorous quantitative analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
