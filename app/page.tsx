"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Share,
  AlertCircle,
  TrendingUp,
  History,
  Trash2,
  RotateCcw,
  Keyboard,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

interface CalculationHistory {
  id: string
  date: string
  workingDaysPerWeek: string
  nationalHolidays: string
  yearEndHolidays: string
  summerHolidays: string
  specialHolidays: string
  workingOnHolidays: string
  totalHolidays: number
}

export default function HolidayCalculator() {
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState("5")
  const [nationalHolidays, setNationalHolidays] = useState("14")
  const [yearEndHolidays, setYearEndHolidays] = useState("5")
  const [summerHolidays, setSummerHolidays] = useState("3")
  const [specialHolidays, setSpecialHolidays] = useState("0")
  const [workingOnHolidays, setWorkingOnHolidays] = useState("0")
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previousTotal, setPreviousTotal] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [changedField, setChangedField] = useState<string | null>(null)
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [totalHolidays, setTotalHolidays] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + H: Toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault()
        setShowHistory(!showHistory)
      }

      // Ctrl/Cmd + S: Share on Twitter (if no errors)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (Object.keys(errors).length === 0 && totalHolidays > 0) {
          shareOnTwitter()
        }
      }

      // Ctrl/Cmd + R: Reset all fields
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault()
        setWorkingDaysPerWeek("5")
        setNationalHolidays("14")
        setYearEndHolidays("5")
        setSummerHolidays("3")
        setSpecialHolidays("0")
        setWorkingOnHolidays("0")
        setErrors({})
      }

      // Ctrl/Cmd + /: Show shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        setShowShortcuts(!showShortcuts)
      }

      // Escape: Close modals
      if (e.key === "Escape") {
        setShowHistory(false)
        setShowShortcuts(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showHistory, showShortcuts, errors])

  const saveToHistory = useCallback(
    (total: number) => {
      if (total === 0 || Object.keys(errors).length > 0) return

      const historyItem: CalculationHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleString("ja-JP"),
        workingDaysPerWeek,
        nationalHolidays,
        yearEndHolidays,
        summerHolidays,
        specialHolidays,
        workingOnHolidays,
        totalHolidays: total,
      }

      const existingHistory = JSON.parse(localStorage.getItem("holidayCalculationHistory") || "[]")
      const newHistory = [historyItem, ...existingHistory].slice(0, 10) // Keep only last 10 calculations

      localStorage.setItem("holidayCalculationHistory", JSON.stringify(newHistory))
      setCalculationHistory(newHistory)
    },
    [workingDaysPerWeek, nationalHolidays, yearEndHolidays, summerHolidays, specialHolidays, workingOnHolidays, errors],
  )

  const loadHistory = useCallback(() => {
    try {
      const history = JSON.parse(localStorage.getItem("holidayCalculationHistory") || "[]")
      setCalculationHistory(history)
    } catch (error) {
      console.error("履歴の読み込みに失敗しました:", error)
      setCalculationHistory([])
    }
  }, [])

  const restoreFromHistory = useCallback((historyItem: CalculationHistory) => {
    setWorkingDaysPerWeek(historyItem.workingDaysPerWeek)
    setNationalHolidays(historyItem.nationalHolidays)
    setYearEndHolidays(historyItem.yearEndHolidays)
    setSummerHolidays(historyItem.summerHolidays)
    setSpecialHolidays(historyItem.specialHolidays)
    setWorkingOnHolidays(historyItem.workingOnHolidays)
    setShowHistory(false)
  }, [])

  const deleteHistoryItem = useCallback(
    (id: string) => {
      const newHistory = calculationHistory.filter((item) => item.id !== id)
      localStorage.setItem("holidayCalculationHistory", JSON.stringify(newHistory))
      setCalculationHistory(newHistory)
    },
    [calculationHistory],
  )

  const clearAllHistory = useCallback(() => {
    localStorage.removeItem("holidayCalculationHistory")
    setCalculationHistory([])
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const validateInput = useCallback(
    (field: string, value: string) => {
      const numValue = Number(value)
      const newErrors = { ...errors }

      if (value === "" || isNaN(numValue) || numValue < 0) {
        newErrors[field] = "0以上の数値を入力してください"
      } else if (numValue > 365) {
        newErrors[field] = "365日以下で入力してください"
      } else if (field === "nationalHolidays" && numValue > 50) {
        newErrors[field] = "祝日数は50日以下で入力してください"
      } else if (field === "yearEndHolidays" && numValue > 20) {
        newErrors[field] = "年末年始休暇は20日以下で入力してください"
      } else if (field === "summerHolidays" && numValue > 20) {
        newErrors[field] = "夏季休暇は20日以下で入力してください"
      } else if (field === "specialHolidays" && numValue > 30) {
        newErrors[field] = "特別休暇は30日以下で入力してください"
      } else if (field === "workingOnHolidays" && numValue > 100) {
        newErrors[field] = "休日出勤日数は100日以下で入力してください"
      } else {
        delete newErrors[field]
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [errors],
  )

  const handleInputChange = useCallback(
    (field: string, value: string, setter: (value: string) => void) => {
      setIsCalculating(true)
      setChangedField(field)
      setter(value)
      validateInput(field, value)

      // Reset feedback after animation
      setTimeout(() => {
        setIsCalculating(false)
        setChangedField(null)
      }, 500)
    },
    [validateInput],
  )

  const calculationBreakdown = useMemo(() => {
    const workDays = Number.parseInt(workingDaysPerWeek)
    const weekendsPerYear = (7 - workDays) * 52
    const holidays = {
      national: Number.parseInt(nationalHolidays) || 0,
      yearEnd: Number.parseInt(yearEndHolidays) || 0,
      summer: Number.parseInt(summerHolidays) || 0,
      special: Number.parseInt(specialHolidays) || 0,
    }
    const workingOnHolidaysDays = Number.parseInt(workingOnHolidays) || 0

    return {
      weekends: weekendsPerYear,
      holidays,
      totalHolidays: holidays.national + holidays.yearEnd + holidays.summer + holidays.special,
      workingOnHolidays: workingOnHolidaysDays,
    }
  }, [workingDaysPerWeek, nationalHolidays, yearEndHolidays, summerHolidays, specialHolidays, workingOnHolidays])

  useEffect(() => {
    const total = Math.max(
      0,
      calculationBreakdown.weekends + calculationBreakdown.totalHolidays - calculationBreakdown.workingOnHolidays,
    )

    if (total !== previousTotal && total > 0) {
      setPreviousTotal(total)
      setTimeout(() => saveToHistory(total), 1000)
    }

    setTotalHolidays(total)
  }, [calculationBreakdown, errors, previousTotal, saveToHistory])

  const calculateSubstituteHolidays = useCallback((holidaysData: Record<string, string>) => {
    let substituteHolidays = 0
    const holidayDates = Object.keys(holidaysData).map((date) => new Date(date))

    for (const dateString in holidaysData) {
      const date = new Date(dateString)
      const dayOfWeek = date.getDay()

      // 祝日が日曜日（0）の場合、振替休日を計算
      if (dayOfWeek === 0) {
        const substituteDate = new Date(date)
        substituteDate.setDate(substituteDate.getDate() + 1)

        // 振替休日が他の祝日と重ならない平日まで繰り返し
        while (true) {
          const substituteDateString = substituteDate.toISOString().split("T")[0]
          const isHoliday = holidaysData[substituteDateString]
          const isWeekend = substituteDate.getDay() === 0 || substituteDate.getDay() === 6

          if (!isHoliday && !isWeekend) {
            substituteHolidays++
            break
          }

          substituteDate.setDate(substituteDate.getDate() + 1)

          // 無限ループ防止（最大7日先まで）
          if (substituteDate.getTime() - date.getTime() > 7 * 24 * 60 * 60 * 1000) {
            break
          }
        }
      }
    }

    return substituteHolidays
  }, [])

  const fetchHolidays = useCallback(async () => {
    setIsLoadingHolidays(true)
    try {
      const currentYear = new Date().getFullYear()
      const response = await fetch(`https://holidays-jp.github.io/api/v1/${currentYear}/date.json`)

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

      const substituteHolidays = calculateSubstituteHolidays(holidaysData)
      const totalHolidaysIncludingSubstitute = weekdayHolidays + substituteHolidays

      setNationalHolidays(totalHolidaysIncludingSubstitute > 0 ? totalHolidaysIncludingSubstitute.toString() : "16")
    } catch (error) {
      console.error("祝日データの取得に失敗しました:", error)
      setNationalHolidays("16")
    } finally {
      setIsLoadingHolidays(false)
    }
  }, [calculateSubstituteHolidays])

  useEffect(() => {
    fetchHolidays()
  }, [fetchHolidays])

  const shareOnTwitter = useCallback(() => {
    const text = `私の年間休日数は${totalHolidays}日でした！\n#年間休日計算ツール\n`
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }, [totalHolidays])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === "Enter" && nextFieldId) {
      e.preventDefault()
      const nextField = document.getElementById(nextFieldId)
      if (nextField) {
        nextField.focus()
      }
    }
    if (e.key === "Tab" && !e.shiftKey && nextFieldId) {
      // Allow default Tab behavior but ensure proper focus order
      setTimeout(() => {
        const nextField = document.getElementById(nextFieldId)
        if (nextField && document.activeElement !== nextField) {
          nextField.focus()
        }
      }, 0)
    }
  }, [])

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "年間休日計算ツール",
    description: "勤務日数と各種休暇から年間の休日数を簡単に計算できる無料ツール",
    url: typeof window !== "undefined" ? window.location.origin : "",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    featureList: ["年間休日計算", "祝日自動取得", "Twitterシェア", "レスポンシブデザイン"],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">年間休日計算ツール</h1>
            <p className="text-gray-600">勤務日数と休日から年間の休日数を簡単に計算できます</p>
          </header>

          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center gap-2"
              aria-label="キーボードショートカットを表示"
            >
              <Keyboard className="w-4 h-4" />
              ショートカット
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
              aria-label={`計算履歴を${showHistory ? "非表示" : "表示"}`}
            >
              <History className="w-4 h-4" />
              計算履歴 ({calculationHistory.length})
            </Button>
          </div>

          {showShortcuts && (
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  キーボードショートカット
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + H</span>
                      <span>履歴表示切替</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + S</span>
                      <span>Twitterシェア</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + R</span>
                      <span>入力値リセット</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">Enter</span>
                      <span>次の項目へ移動</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">※ Macでは Ctrl の代わりに Cmd キーを使用してください</p>
              </CardContent>
            </Card>
          )}

          {showHistory && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <History className="w-5 h-5 text-green-500" />
                    計算履歴
                  </span>
                  {calculationHistory.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllHistory}
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      aria-label="全ての履歴を削除"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      全削除
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculationHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">計算履歴がありません</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {calculationHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-blue-600">{item.totalHolidays}日</span>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            週{item.workingDaysPerWeek}日勤務 | 祝日{item.nationalHolidays}日 | 年末年始
                            {item.yearEndHolidays}日 | 夏季{item.summerHolidays}日
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => restoreFromHistory(item)}
                            className="text-blue-600 hover:text-blue-700"
                            aria-label="この設定を復元"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="この履歴を削除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <section>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  年間休日計算
                  {isCalculating && (
                    <div className="flex items-center gap-1 text-blue-500 text-sm">
                      <TrendingUp className="w-4 h-4 animate-pulse" />
                      <span className="animate-pulse">計算中...</span>
                    </div>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600">勤務日数と休日から年間の休日数を計算します</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing input fields with improved accessibility */}
                <div className="space-y-2">
                  <Label htmlFor="working-days">週の勤務日数</Label>
                  <Select
                    value={workingDaysPerWeek}
                    onValueChange={(value) => {
                      setIsCalculating(true)
                      setChangedField("workingDaysPerWeek")
                      setWorkingDaysPerWeek(value)
                      setTimeout(() => {
                        setIsCalculating(false)
                        setChangedField(null)
                      }, 500)
                    }}
                  >
                    <SelectTrigger
                      className={`w-full transition-all duration-300 ${changedField === "workingDaysPerWeek" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                      id="working-days"
                      aria-describedby="working-days-help"
                    >
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
                    週の勤務日数を選択してください
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="national-holidays">祝日数</Label>
                  <Input
                    id="national-holidays"
                    type="number"
                    min="0"
                    max="50"
                    value={nationalHolidays}
                    onChange={(e) => handleInputChange("nationalHolidays", e.target.value, setNationalHolidays)}
                    onKeyDown={(e) => handleKeyDown(e, "year-end-holidays")}
                    className={`w-full transition-all duration-300 ${errors.nationalHolidays ? "border-red-500" : ""} ${changedField === "nationalHolidays" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    aria-describedby="national-holidays-help"
                    aria-invalid={!!errors.nationalHolidays}
                    tabIndex={1}
                  />
                  {errors.nationalHolidays && (
                    <div
                      className="flex items-center gap-1 text-red-600 text-xs animate-in slide-in-from-left-2"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.nationalHolidays}
                    </div>
                  )}
                  <p id="national-holidays-help" className="text-xs text-gray-500">
                    {isLoadingHolidays
                      ? "祝日データを取得中..."
                      : "今年の平日の祝日数が設定されています（振替休日含む、土日重複分は除外済み）"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year-end-holidays">年末年始休暇</Label>
                  <Input
                    id="year-end-holidays"
                    type="number"
                    min="0"
                    max="20"
                    value={yearEndHolidays}
                    onChange={(e) => handleInputChange("yearEndHolidays", e.target.value, setYearEndHolidays)}
                    onKeyDown={(e) => handleKeyDown(e, "summer-holidays")}
                    className={`w-full transition-all duration-300 ${errors.yearEndHolidays ? "border-red-500" : ""} ${changedField === "yearEndHolidays" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    aria-describedby="year-end-holidays-help"
                    aria-invalid={!!errors.yearEndHolidays}
                    tabIndex={2}
                  />
                  {errors.yearEndHolidays && (
                    <div
                      className="flex items-center gap-1 text-red-600 text-xs animate-in slide-in-from-left-2"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.yearEndHolidays}
                    </div>
                  )}
                  <p id="year-end-holidays-help" className="text-xs text-gray-500">
                    12月29日～1月3日の場合は5日など（元旦を除く）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summer-holidays">夏季休暇</Label>
                  <Input
                    id="summer-holidays"
                    type="number"
                    min="0"
                    max="20"
                    value={summerHolidays}
                    onChange={(e) => handleInputChange("summerHolidays", e.target.value, setSummerHolidays)}
                    onKeyDown={(e) => handleKeyDown(e, "special-holidays")}
                    className={`w-full transition-all duration-300 ${errors.summerHolidays ? "border-red-500" : ""} ${changedField === "summerHolidays" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    aria-describedby="summer-holidays-help"
                    aria-invalid={!!errors.summerHolidays}
                    tabIndex={3}
                  />
                  {errors.summerHolidays && (
                    <div
                      className="flex items-center gap-1 text-red-600 text-xs animate-in slide-in-from-left-2"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.summerHolidays}
                    </div>
                  )}
                  <p id="summer-holidays-help" className="text-xs text-gray-500">
                    お盆期間などの夏季特別休暇（平均は3～4日）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special-holidays">特別休暇</Label>
                  <Input
                    id="special-holidays"
                    type="number"
                    min="0"
                    max="30"
                    value={specialHolidays}
                    onChange={(e) => handleInputChange("specialHolidays", e.target.value, setSpecialHolidays)}
                    onKeyDown={(e) => handleKeyDown(e, "working-holidays")}
                    className={`w-full transition-all duration-300 ${errors.specialHolidays ? "border-red-500" : ""} ${changedField === "specialHolidays" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    aria-describedby="special-holidays-help"
                    aria-invalid={!!errors.specialHolidays}
                    tabIndex={4}
                  />
                  {errors.specialHolidays && (
                    <div
                      className="flex items-center gap-1 text-red-600 text-xs animate-in slide-in-from-left-2"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.specialHolidays}
                    </div>
                  )}
                  <p id="special-holidays-help" className="text-xs text-gray-500">
                    創立記念日など、その他の特別休暇
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="working-holidays">休日出勤日数</Label>
                  <Input
                    id="working-holidays"
                    type="number"
                    min="0"
                    max="100"
                    value={workingOnHolidays}
                    onChange={(e) => handleInputChange("workingOnHolidays", e.target.value, setWorkingOnHolidays)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className={`w-full transition-all duration-300 ${errors.workingOnHolidays ? "border-red-500" : ""} ${changedField === "workingOnHolidays" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    aria-describedby="working-holidays-help"
                    aria-invalid={!!errors.workingOnHolidays}
                    tabIndex={5}
                  />
                  {errors.workingOnHolidays && (
                    <div
                      className="flex items-center gap-1 text-red-600 text-xs animate-in slide-in-from-left-2"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.workingOnHolidays}
                    </div>
                  )}
                  <p id="working-holidays-help" className="text-xs text-gray-500">
                    年間の休日出勤日数
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            {Object.keys(errors).length > 0 ? (
              <Card className="mb-8 bg-red-50 border-red-200" role="alert">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 mb-2">入力エラーがあります</p>
                    <p className="text-sm text-red-600">上記のエラーを修正してください</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">あなたの年間休日数は</p>
                    <div
                      className={`text-5xl font-bold text-blue-600 mb-4 transition-all duration-500 ${isCalculating ? "scale-105 text-blue-700" : ""}`}
                      aria-label={`${totalHolidays}日`}
                      role="status"
                      aria-live="polite"
                    >
                      {totalHolidays}日
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4 text-sm">
                      <h3 className="font-semibold text-gray-700 mb-2">計算内訳</h3>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between">
                          <span>週末・休日:</span>
                          <span className="font-medium">{calculationBreakdown.weekends}日</span>
                        </div>
                        <div className="flex justify-between">
                          <span>祝日:</span>
                          <span className="font-medium">{calculationBreakdown.holidays.national}日</span>
                        </div>
                        <div className="flex justify-between">
                          <span>年末年始:</span>
                          <span className="font-medium">{calculationBreakdown.holidays.yearEnd}日</span>
                        </div>
                        <div className="flex justify-between">
                          <span>夏季休暇:</span>
                          <span className="font-medium">{calculationBreakdown.holidays.summer}日</span>
                        </div>
                        <div className="flex justify-between">
                          <span>特別休暇:</span>
                          <span className="font-medium">{calculationBreakdown.holidays.special}日</span>
                        </div>
                        {calculationBreakdown.workingOnHolidays > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>休日出勤:</span>
                            <span className="font-medium">-{calculationBreakdown.workingOnHolidays}日</span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-blue-600">
                          <span>合計:</span>
                          <span>{totalHolidays}日</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">結果をシェアする:</p>
                    <Button
                      onClick={shareOnTwitter}
                      className="bg-blue-500 hover:bg-blue-600"
                      aria-label="計算結果をTwitterでシェア"
                      tabIndex={6}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Twitterでシェア
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          <aside className="text-xs text-gray-500 space-y-1 mb-8">
            <p>
              ※ この計算は簡易的なものです。振替休日は自動計算されていますが、企業独自の休日制度は考慮していません。
            </p>
            <p>※ より正確な計算には、実際のカレンダーを参照してください。</p>
          </aside>

          <nav className="text-center">
            <Link href="/about">
              <Button variant="outline" className="mb-4 bg-transparent" tabIndex={7}>
                📘 このツールについて詳しく見る
              </Button>
            </Link>
          </nav>

          <footer className="text-center text-sm text-gray-500 mt-8">© 2025 年間休日計算ツール</footer>
        </div>
      </main>
    </>
  )
}
