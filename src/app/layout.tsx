import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:       "NexaMusic — Stream the Music. Feel the Vibe.",
  description: "Next-generation music streaming platform. Cinematic, immersive, zero sign-up.",
  keywords:    ["music", "streaming", "lo-fi", "chill", "electronic"],
  authors:     [{ name: "NexaMusic" }],
  openGraph: {
    title:       "NexaMusic",
    description: "Cinematic music streaming — zero sign-up.",
    type:        "website",
    siteName:    "NexaMusic",
  },
  twitter: {
    card:  "summary_large_image",
    title: "NexaMusic",
  },
};

export const viewport: Viewport = {
  width:         "device-width",
  initialScale:  1,
  themeColor:    "#0F0A1E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}