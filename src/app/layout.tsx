import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "npk research — DeFi Platform",
  description: "Airdrop tracker, liquidation calculator, loop simulator, and admin panel for DeFi research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
