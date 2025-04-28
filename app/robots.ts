import type { MetadataRoute } from "next"

// 静的エクスポート用の設定
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://nenkyu.vercel.app/sitemap.xml",
  }
}
