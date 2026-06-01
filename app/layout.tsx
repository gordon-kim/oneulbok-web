import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오늘복",
  description: "광고 보고 복권과 응모권을 받는 행운 리워드 앱",
  manifest: "/manifest.json",
  themeColor: "#FF642A",
  appleWebApp: {
    capable: true,
    title: "오늘복",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/images/bok-mascot-v2.png",
    apple: "/images/bok-mascot-v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
