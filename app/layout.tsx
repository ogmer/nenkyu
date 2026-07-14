import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
}

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
  verification: {
    google: "QnUsOtyQqqGQspitKoNedHKpBusxYT0S5xXnYFT-8u8",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://holidays-jp.github.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NNRS9GPGQX" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-NNRS9GPGQX');`}
        </Script>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
