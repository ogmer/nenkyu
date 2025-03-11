import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "年間休日計算ツール"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1d4ed8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          fontSize: 64,
          fontWeight: "bold",
          color: "#1e293b",
        }}
      >
        📅 年間休日計算ツール
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#64748b",
          marginBottom: "3rem",
        }}
      >
        あなたの年間休日数はいくつ？簡単に計算できます
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}

