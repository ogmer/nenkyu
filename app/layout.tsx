import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "年間休日計算ツール | 勤務日数から年間休日数を自動計算",
  description:
    "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツールです。祝日数は自動取得され、土日の重複も考慮した正確な計算を行います。",
  keywords: ["年間休日", "休日計算", "勤務日数", "祝日", "年末年始", "夏季休暇", "計算ツール"],
  authors: [{ name: "年間休日計算ツール" }],
  creator: "年間休日計算ツール",
  robots: "index, follow",
  metadataBase: new URL("https://annual-holiday-calculator.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "年間休日計算ツール | 勤務日数から年間休日数を自動計算",
    description:
      "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツールです。祝日数は自動取得され、土日の重複も考慮した正確な計算を行います。",
    siteName: "年間休日計算ツール",
    images: [
      {
        url: "/favicon.png",
        width: 32,
        height: 32,
        alt: "年間休日計算ツール",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "年間休日計算ツール | 勤務日数から年間休日数を自動計算",
    description: "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツールです。",
    images: ["/favicon.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={GeistSans.variable}>
      <head>
        <link
          rel="preload"
          href="/_next/static/media/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>

      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
