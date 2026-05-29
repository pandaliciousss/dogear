import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Chewy } from "next/font/google";
import { copy } from "@/config/content";
import "./globals.css";

// Serif for book titles and small literary touches.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Display face for the Dogear wordmark — fat, soft, hand-drawn / bubbly.
const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
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
    <html
      lang="en"
      className={`${fraunces.variable} ${chewy.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
