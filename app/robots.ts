import type { MetadataRoute } from "next"

// 静的エクスポート用の設定を追加
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://your-domain.com/sitemap.xml",
  }
}
