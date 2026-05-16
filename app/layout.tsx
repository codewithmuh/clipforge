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
    "Paste a YouTube URL. AI ranks the most viral moments /10 and renders real 9:16 MP4s for Shorts, TikTok and Reels. Open-source, free, BYOK.",
  metadataBase: new URL("https://clipforge.app"),
  openGraph: {
    title: "ClipForge — open-source AI video clipper",
    description:
      "Paste a YouTube URL → AI ranks the moments → real 9:16 MP4s ready to post.",
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
