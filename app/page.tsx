"use client"

import type React from "react"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchHolidaysData } from "./actions/holidays"
import HolidayCalculatorClient from "@/components/HolidayCalculatorClient"

const sanitizeNumericInput = (value: string): string => {
  // 数値以外の文字を除去し、負の値を0に変換
  const numericValue = Number.parseInt(value.replace(/[^0-9]/g, "")) || 0
  // 最大値制限（年間365日を超えないように）
  return Math.min(Math.max(numericValue, 0), 365).toString()
}

const validateInput = (value: string, min = 0, max = 365): boolean => {
  const numValue = Number.parseInt(value)
  return !isNaN(numValue) && numValue >= min && numValue <= max
}

const MemoizedInput = memo(
  ({
    id,
    value,
    onChange,
    onKeyDown,
    min = "0",
    max = "365",
    helpText,
    label,
    nextFieldId,
  }: {
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent, nextFieldId?: string) => void
    min?: string
    max?: string
    helpText: string
    label: string
    nextFieldId?: string
  }) => (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => onKeyDown(e, nextFieldId)}
        className={`w-full ${!validateInput(value, Number.parseInt(min), Number.parseInt(max)) ? "border-red-500" : ""}`}
        aria-describedby={`${id}-help`}
        aria-invalid={!validateInput(value, Number.parseInt(min), Number.parseInt(max))}
        aria-required={id === "national-holidays"}
      />
      <p id={`${id}-help`} className="text-xs text-gray-500">
        {helpText}
      </p>
    </div>
  ),
)

MemoizedInput.displayName = "MemoizedInput"

const ShareButtons = memo(
  ({
    totalHolidays,
    onTwitterShare,
    onFacebookShare,
  }: {
    totalHolidays: number
    onTwitterShare: () => void
    onFacebookShare: () => void
  }) => (
    <div className="flex gap-3 justify-center" role="group" aria-label="シェアボタン">
      <Button
        onClick={onTwitterShare}
        className="bg-blue-500 hover:bg-blue-600"
        aria-label={`Twitterで${totalHolidays}日の結果をシェア`}
      >
        <svg className="w-4 h-4 mr-2" aria-hidden="true">
          {/* Twitter icon SVG here */}
        </svg>
        Twitterでシェア
      </Button>
      <Button
        onClick={onFacebookShare}
        className="bg-blue-700 hover:bg-blue-800"
        aria-label={`Facebookで${totalHolidays}日の結果をシェア`}
      >
        <svg className="w-4 h-4 mr-2" aria-hidden="true">
          {/* Facebook icon SVG here */}
        </svg>
        Facebookでシェア
      </Button>
    </div>
  ),
)

ShareButtons.displayName = "ShareButtons"

export default async function HolidayCalculator() {
  const currentYear = new Date().getFullYear()
  const initialHolidays = await fetchHolidaysData(currentYear)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "年間休日計算ツール",
    description: "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツール",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <HolidayCalculatorClient initialHolidays={initialHolidays || 14} />

      <div className="max-w-2xl mx-auto px-4">
        <aside className="text-xs text-gray-500 space-y-1 mb-8" role="note">
          <p>※ この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</p>
          <p>※ より正確な計算には、実際のカレンダーを参照してください。</p>
        </aside>

        <nav className="text-center" aria-label="関連ページへのナビゲーション">
          <Link href="/about">
            <Button variant="outline" className="mb-4 bg-transparent">
              📘 このツールについて詳しく見る
            </Button>
          </Link>
        </nav>

        <footer className="text-center text-sm text-gray-500 mt-8" role="contentinfo">
          © 2025 年間休日計算ツール
        </footer>
      </div>
    </>
  )
}
