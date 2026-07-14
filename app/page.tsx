"use client"

import type React from "react"
import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Share } from "lucide-react"
import Link from "next/link"

const CURRENT_YEAR = new Date().getFullYear()

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "年間休日計算ツール",
  description: "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツール",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  featureList: ["年間休日計算", "祝日自動取得", "Twitterシェア", "Facebookシェア", "レスポンシブデザイン"],
})

// 今年の平日の祝日数を取得（土日と重なる祝日は除外）
const fetchWeekdayHolidayCount = async (): Promise<number> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${CURRENT_YEAR}/date.json`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Record<string, string> = await res.json()

    const weekdayHolidays = Object.keys(data).reduce((count, dateStr) => {
      const day = new Date(dateStr).getDay()
      return day !== 0 && day !== 6 ? count + 1 : count
    }, 0)

    return weekdayHolidays > 0 ? Math.min(50, weekdayHolidays) : 14
  } finally {
    clearTimeout(timeoutId)
  }
}

const sanitizeNumericInput = (value: string): string => {
  const numericValue = Number.parseInt(value.replace(/[^0-9]/g, "")) || 0
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
  }) => {
    const minNum = Number.parseInt(min)
    const maxNum = Number.parseInt(max)
    const isValid = validateInput(value, minNum, maxNum)
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => onKeyDown(e, nextFieldId)}
          className={`w-full ${!isValid ? "border-red-500" : ""}`}
          aria-describedby={`${id}-help`}
          aria-invalid={!isValid}
          aria-required={id === "national-holidays"}
        />
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {helpText}
        </p>
      </div>
    )
  },
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
        <Share className="w-4 h-4 mr-2" aria-hidden="true" />
        Twitterでシェア
      </Button>
      <Button
        onClick={onFacebookShare}
        className="bg-blue-700 hover:bg-blue-800"
        aria-label={`Facebookで${totalHolidays}日の結果をシェア`}
      >
        <Share className="w-4 h-4 mr-2" aria-hidden="true" />
        Facebookでシェア
      </Button>
    </div>
  ),
)

ShareButtons.displayName = "ShareButtons"

export default function HolidayCalculator() {
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState("5")
  const [nationalHolidays, setNationalHolidays] = useState("14")
  const [yearEndHolidays, setYearEndHolidays] = useState("5")
  const [summerHolidays, setSummerHolidays] = useState("3")
  const [specialHolidays, setSpecialHolidays] = useState("0")
  const [workingOnHolidays, setWorkingOnHolidays] = useState("0")

  const {
    data: fetchedHolidayCount,
    isLoading: isLoadingHolidays,
    isError: holidayError,
  } = useQuery({
    queryKey: ["weekday-holidays", CURRENT_YEAR],
    queryFn: fetchWeekdayHolidayCount,
  })

  const handleKeyDown = useCallback((e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === "Enter" && nextFieldId) {
      e.preventDefault()
      document.getElementById(nextFieldId)?.focus()
    }
  }, [])

  const handleNumericInput = useCallback((setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(sanitizeNumericInput(e.target.value))
    }
  }, [])

  const totalHolidays = useMemo(() => {
    const workDays = Math.max(1, Math.min(7, Number.parseInt(workingDaysPerWeek) || 5))
    const weekendsPerYear = (7 - workDays) * 52
    const holidays =
      Math.max(0, Math.min(50, Number.parseInt(nationalHolidays) || 0)) +
      Math.max(0, Math.min(20, Number.parseInt(yearEndHolidays) || 0)) +
      Math.max(0, Math.min(20, Number.parseInt(summerHolidays) || 0)) +
      Math.max(0, Math.min(50, Number.parseInt(specialHolidays) || 0))
    return Math.max(0, Math.min(365, weekendsPerYear + holidays - Math.max(0, Math.min(100, Number.parseInt(workingOnHolidays) || 0))))
  }, [workingDaysPerWeek, nationalHolidays, yearEndHolidays, summerHolidays, specialHolidays, workingOnHolidays])

  // TanStack Queryの取得結果を入力欄へ反映（取得成功時のみ・ユーザー編集は上書きしない）
  useEffect(() => {
    if (fetchedHolidayCount !== undefined) {
      setNationalHolidays(fetchedHolidayCount.toString())
    }
  }, [fetchedHolidayCount])

  useEffect(() => {
    if (holidayError) {
      setNationalHolidays("16")
    }
  }, [holidayError])

  const openShareUrl = useCallback((url: string) => {
    // アンカー要素経由で開くことで、モバイルブラウザのポップアップブロックを回避する
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.target = "_blank"
    anchor.rel = "noopener noreferrer"
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }, [])

  const shareOnTwitter = useCallback(() => {
    const text = `私の年間休日数は${totalHolidays}日でした！\n#年間休日計算ツール\n`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ text, url: window.location.href })
        .catch(() => openShareUrl(shareUrl))
      return
    }
    openShareUrl(shareUrl)
  }, [totalHolidays, openShareUrl])

  const shareOnFacebook = useCallback(() => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`私の年間休日数は${totalHolidays}日でした！`)}`
    openShareUrl(shareUrl)
  }, [totalHolidays, openShareUrl])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      <div className="min-h-screen bg-gray-50 py-8 px-4" role="application" aria-label="年間休日計算ツール">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">年間休日計算ツール</h1>
            <p className="text-gray-600">勤務日数と休日から年間の休日数を簡単に計算できます</p>
          </header>

          <main>
            <form onSubmit={(e) => e.preventDefault()} aria-label="休日計算フォーム">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                    年間休日計算
                  </CardTitle>
                  <p className="text-sm text-gray-600">勤務日数と休日から年間の休日数を計算します</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="working-days">週の勤務日数</Label>
                    <Select
                      value={workingDaysPerWeek}
                      onValueChange={setWorkingDaysPerWeek}
                      aria-describedby="working-days-help"
                    >
                      <SelectTrigger className="w-full" id="working-days" aria-label="週の勤務日数を選択">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5日 (月～金)</SelectItem>
                        <SelectItem value="6">6日 (月～土)</SelectItem>
                        <SelectItem value="4">4日</SelectItem>
                        <SelectItem value="3">3日</SelectItem>
                      </SelectContent>
                    </Select>
                    <p id="working-days-help" className="text-xs text-gray-500 sr-only">
                      一般的には5日（月曜日から金曜日）です
                    </p>
                  </div>

                  <MemoizedInput
                    id="national-holidays"
                    label="祝日数"
                    value={nationalHolidays}
                    onChange={handleNumericInput(setNationalHolidays)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="50"
                    nextFieldId="year-end-holidays"
                    helpText={
                      isLoadingHolidays
                        ? "祝日データを取得中..."
                        : holidayError
                          ? "祝日データの取得に失敗しました。標準値（16日）を設定しています"
                          : "今年の平日の祝日数が設定されています（土日重複分は除外済み）"
                    }
                  />

                  <MemoizedInput
                    id="year-end-holidays"
                    label="年末年始休暇"
                    value={yearEndHolidays}
                    onChange={handleNumericInput(setYearEndHolidays)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="20"
                    nextFieldId="summer-holidays"
                    helpText="12月29日～1月3日の場合は5日など（元旦を除く）"
                  />

                  <MemoizedInput
                    id="summer-holidays"
                    label="夏季休暇"
                    value={summerHolidays}
                    onChange={handleNumericInput(setSummerHolidays)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="20"
                    nextFieldId="special-holidays"
                    helpText="お盆期間などの夏季特別休暇（平均は3～4日）"
                  />

                  <MemoizedInput
                    id="special-holidays"
                    label="特別休暇"
                    value={specialHolidays}
                    onChange={handleNumericInput(setSpecialHolidays)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="50"
                    nextFieldId="working-holidays"
                    helpText="創立記念日など、その他の特別休暇"
                  />

                  <MemoizedInput
                    id="working-holidays"
                    label="休日出勤日数"
                    value={workingOnHolidays}
                    onChange={handleNumericInput(setWorkingOnHolidays)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="100"
                    helpText="年間の休日出勤日数(マイナス)"
                  />
                </CardContent>
              </Card>
            </form>

            <section aria-label="計算結果" role="region">
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">あなたの年間休日数は</p>
                    <div
                      className="text-5xl font-bold text-blue-600 mb-4"
                      aria-live="polite"
                      aria-atomic="true"
                      role="status"
                      aria-label={`計算結果: ${totalHolidays}日`}
                    >
                      {totalHolidays}日
                    </div>
                    <p className="text-sm text-gray-600 mb-4">結果をシェアする:</p>
                    <ShareButtons
                      totalHolidays={totalHolidays}
                      onTwitterShare={shareOnTwitter}
                      onFacebookShare={shareOnFacebook}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <aside className="text-xs text-gray-500 space-y-1 mb-8" role="note" aria-label="計算に関する注意事項">
              <p>※ この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</p>
              <p>※ より正確な計算には、実際のカレンダーを参照してください。</p>
            </aside>

            <nav className="text-center" aria-label="関連ページへのナビゲーション">
              <Link href="/about">
                <Button
                  variant="outline"
                  className="mb-4 bg-transparent"
                  aria-label="このツールについて詳しく見るページへ移動"
                >
                  📘 このツールについて詳しく見る
                </Button>
              </Link>
            </nav>
          </main>

          <footer className="text-center text-sm text-gray-500 mt-8" role="contentinfo">
            © {CURRENT_YEAR} 年間休日計算ツール
          </footer>
        </div>
      </div>
    </>
  )
}
