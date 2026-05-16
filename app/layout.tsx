import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClipForge — Turn YouTube videos into viral shorts in seconds",
  description:
    "Paste a YouTube URL, get 5 viral short-form clips with hooks, captions, and CapCut / Premiere exports. BYOK Claude or Gemini. The open-source OpusClip alternative.",
  metadataBase: new URL("https://clipforge.app"),
  openGraph: {
    title: "ClipForge — AI YouTube Shorts editor",
    description:
      "Paste a YouTube URL → get 5 viral short-form clips ready for CapCut and Premiere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
