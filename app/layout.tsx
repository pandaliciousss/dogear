import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { copy } from "@/config/content";
import "./globals.css";

// Serif for the wordmark and book titles — warm, literary, small-press.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Sans for UI text.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${copy.appName} — ${copy.subCopy}`,
  description: "Books chosen by mood, not genre.",
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
