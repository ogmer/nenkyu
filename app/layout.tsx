import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { Header } from "./header"
import { JsonLd } from "./jsonld"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata = {
  title: "年間休日計算ツール",
  description: "勤務日数と休日から年間の休日数を簡単に計算できるツールです。",
  keywords: ["年間休日", "休日計算", "勤務日数", "祝日", "年末年始休暇", "夏季休暇", "休日数計算"],
  openGraph: {
    title: "年間休日計算ツール",
    description: "勤務日数と休日から年間の休日数を簡単に計算できるツールです。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "年間休日計算ツール",
    description: "勤務日数と休日から年間の休日数を簡単に計算できるツールです。",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          <JsonLd />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
