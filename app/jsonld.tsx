"use client"

import { useEffect } from "react"

export function JsonLd() {
  useEffect(() => {
    // クライアントサイドでのみ実行
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "年間休日計算ツール",
      description: "勤務日数と休日から年間の休日数を簡単に計算できるツールです。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      author: {
        "@type": "Person",
        name: "年間休日計算ツール開発者",
      },
    })
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
