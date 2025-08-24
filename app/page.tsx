"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Share } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const TwitterShareButton = dynamic(() => import("@/components/twitter-share-button"), {
  loading: () => <Button disabled>読み込み中...</Button>,
  ssr: false,
})

export default function HolidayCalculator() {
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState("5")
  const [nationalHolidays, setNationalHolidays] = useState("14")
  const [yearEndHolidays, setYearEndHolidays] = useState("5")
  const [summerHolidays, setSummerHolidays] = useState("3")
  const [specialHolidays, setSpecialHolidays] = useState("0")
  const [workingOnHolidays, setWorkingOnHolidays] = useState("0")
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  const totalHolidays = useMemo(() => {
    const workDays = Number.parseInt(workingDaysPerWeek)
    const weekendsPerYear = (7 - workDays) * 52
    const holidays =
      Number.parseInt(nationalHolidays) +
      Number.parseInt(yearEndHolidays) +
      Number.parseInt(summerHolidays) +
      Number.parseInt(specialHolidays)
    const workingOnHolidaysDays = Number.parseInt(workingOnHolidays)

    return weekendsPerYear + holidays - workingOnHolidaysDays
  }, [workingDaysPerWeek, nationalHolidays, yearEndHolidays, summerHolidays, specialHolidays, workingOnHolidays])

  const fetchHolidays = useCallback(async () => {
    setIsLoadingHolidays(true)
    try {
      const currentYear = new Date().getFullYear()
      const response = await fetch(`https://holidays-jp.github.io/api/v1/${currentYear}/date.json`, {
        cache: "force-cache",
        next: { revalidate: 86400 }, // 24時間キャッシュ
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const holidaysData = await response.json()

      let weekdayHolidays = 0
      for (const dateString in holidaysData) {
        const date = new Date(dateString)
        const dayOfWeek = date.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          weekdayHolidays++
        }
      }

      if (weekdayHolidays > 0) {
        setNationalHolidays(weekdayHolidays.toString())
      } else {
        setNationalHolidays("14")
      }
    } catch (error) {
      console.error("祝日データの取得に失敗しました:", error)
      setNationalHolidays("14")
    } finally {
      setIsLoadingHolidays(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHolidays()
    }, 100)

    return () => clearTimeout(timer)
  }, [fetchHolidays])

  const shareOnTwitter = useCallback(() => {
    const text = `私の年間休日数は${totalHolidays}日でした！\n#年間休日計算ツール\n`
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }, [totalHolidays])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "年間休日計算ツール",
            description: "勤務日数と休日から年間の休日数を簡単に計算できるWebアプリケーション",
            url: "https://annual-holiday-calculator.vercel.app",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "JPY",
            },
            creator: {
              "@type": "Organization",
              name: "年間休日計算ツール",
            },
            datePublished: "2025-01-01",
            inLanguage: "ja-JP",
            keywords: "年間休日, 休日計算, 勤務日数, 祝日, 計算ツール, 無料",
            featureList: [
              "週の勤務日数から自動計算",
              "祝日数の自動取得",
              "年末年始・夏季休暇の設定",
              "Twitter共有機能",
              "土日重複祝日の除外",
            ],
          }),
        }}
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">年間休日計算ツール</h1>
            <p className="text-gray-600">勤務日数と休日から年間の休日数を簡単に計算できます</p>
          </header>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                年間休日計算
              </CardTitle>
              <p className="text-sm text-gray-600">勤務日数と休日から年間の休日数を計算します</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="working-days">週の勤務日数</Label>
                <Select value={workingDaysPerWeek} onValueChange={setWorkingDaysPerWeek}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5日 (月～金)</SelectItem>
                    <SelectItem value="6">6日 (月～土)</SelectItem>
                    <SelectItem value="4">4日</SelectItem>
                    <SelectItem value="3">3日</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="national-holidays">祝日数</Label>
                <Input
                  id="national-holidays"
                  type="number"
                  value={nationalHolidays}
                  onChange={(e) => setNationalHolidays(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {isLoadingHolidays
                    ? "祝日データを取得中..."
                    : "今年の平日の祝日数が設定されています（土日重複分は除外済み）"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year-end-holidays">年末年始休暇</Label>
                <Input
                  id="year-end-holidays"
                  type="number"
                  value={yearEndHolidays}
                  onChange={(e) => setYearEndHolidays(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">12月29日～1月3日の場合は5日など（元旦を除く）</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summer-holidays">夏季休暇</Label>
                <Input
                  id="summer-holidays"
                  type="number"
                  value={summerHolidays}
                  onChange={(e) => setSummerHolidays(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">お盆期間などの夏季特別休暇（平均は3～4日）</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-holidays">特別休暇</Label>
                <Input
                  id="special-holidays"
                  type="number"
                  value={specialHolidays}
                  onChange={(e) => setSpecialHolidays(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="working-holidays">休日出勤日数</Label>
                <Input
                  id="working-holidays"
                  type="number"
                  value={workingOnHolidays}
                  onChange={(e) => setWorkingOnHolidays(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-700 mb-2">あなたの年間休日数は</p>
                <div className="text-5xl font-bold text-blue-600 mb-4">{totalHolidays}日</div>
                <p className="text-sm text-gray-600 mb-4">結果をシェアする:</p>
                <Button onClick={shareOnTwitter} className="bg-blue-500 hover:bg-blue-600">
                  <Share className="w-4 h-4 mr-2" />
                  Twitterでシェア
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-gray-500 space-y-1 mb-8">
            <p>※ この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</p>
            <p>※ より正確な計算には、実際のカレンダーを参照してください。</p>
          </div>

          <div className="text-center">
            <Link href="/about">
              <Button variant="outline" className="mb-4 bg-transparent">
                📘 このツールについて詳しく見る
              </Button>
            </Link>
          </div>

          <footer className="text-center text-sm text-gray-500 mt-8">© 2025 年間休日計算ツール</footer>
        </div>
      </div>
    </>
  )
}
