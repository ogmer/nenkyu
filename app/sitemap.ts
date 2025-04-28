import type { MetadataRoute } from "next"

// 静的エクスポート用の設定
export const dynamic = "force-static"

// 現在の日付を固定値として使用
const lastModified = new Date("2023-04-28")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]
}
