import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { Header } from "./header"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "年間休日計算ツール",
  description: "勤務日数と休日から年間の休日数を簡単に計算できるツールです。",
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
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}



import './globals.css'