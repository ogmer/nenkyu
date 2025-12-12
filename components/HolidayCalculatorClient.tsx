"use client"

import type React from "react"
import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Share } from "lucide-react"

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
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
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

export default function HolidayCalculatorClient({ initialHolidays }: { initialHolidays: number }) {
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState("5")
  const [nationalHolidays, setNationalHolidays] = useState(initialHolidays.toString())
  const [yearEndHolidays, setYearEndHolidays] = useState("5")
  const [summerHolidays, setSummerHolidays] = useState("3")
  const [specialHolidays, setSpecialHolidays] = useState("0")
  const [workingOnHolidays, setWorkingOnHolidays] = useState("0")

  const handleKeyDown = useCallback((e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === "Enter" && nextFieldId) {
      e.preventDefault()
      const nextField = document.getElementById(nextFieldId)
      if (nextField) {
        nextField.focus()
      }
    }
  }, [])

  const handleNumericInput = useCallback((setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeNumericInput(e.target.value)
      setter(sanitizedValue)
    }
  }, [])

  const totalHolidays = useMemo(() => {
    const workDays = Math.max(1, Math.min(7, Number.parseInt(workingDaysPerWeek) || 5))
    const weekendsPerYear = (7 - workDays) * 52

    const validatedNationalHolidays = Math.max(0, Math.min(50, Number.parseInt(nationalHolidays) || 0))
    const validatedYearEndHolidays = Math.max(0, Math.min(20, Number.parseInt(yearEndHolidays) || 0))
    const validatedSummerHolidays = Math.max(0, Math.min(20, Number.parseInt(summerHolidays) || 0))
    const validatedSpecialHolidays = Math.max(0, Math.min(50, Number.parseInt(specialHolidays) || 0))
    const validatedWorkingOnHolidays = Math.max(0, Math.min(100, Number.parseInt(workingOnHolidays) || 0))

    const holidays =
      validatedNationalHolidays + validatedYearEndHolidays + validatedSummerHolidays + validatedSpecialHolidays
    const totalCalculated = weekendsPerYear + holidays - validatedWorkingOnHolidays

    return Math.max(0, Math.min(365, totalCalculated))
  }, [workingDaysPerWeek, nationalHolidays, yearEndHolidays, summerHolidays, specialHolidays, workingOnHolidays])

  const shareOnTwitter = useCallback(() => {
    const sanitizedHolidays = Math.max(0, Math.min(365, totalHolidays))
    const text = `私の年間休日数は${sanitizedHolidays}日でした！\n#年間休日計算ツール\n`
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    )
  }, [totalHolidays])

  const shareOnFacebook = useCallback(() => {
    const sanitizedHolidays = Math.max(0, Math.min(365, totalHolidays))
    const text = `私の年間休日数は${sanitizedHolidays}日でした！`
    const url = window.location.href
    window.open(
      `https://www.facebook.com/dialog/share?app_id=966242223397117&href=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}&hashtag=${encodeURIComponent("#年間休日計算ツール")}`,
      "_blank",
      "noopener,noreferrer",
    )
  }, [totalHolidays])

  return (
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
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="working-days">週の勤務日数</Label>
                  <Select value={workingDaysPerWeek} onValueChange={setWorkingDaysPerWeek}>
                    <SelectTrigger className="w-full" id="working-days">
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

                <MemoizedInput
                  id="national-holidays"
                  label="祝日数"
                  value={nationalHolidays}
                  onChange={handleNumericInput(setNationalHolidays)}
                  onKeyDown={handleKeyDown}
                  min="0"
                  max="50"
                  nextFieldId="year-end-holidays"
                  helpText="今年の平日の祝日数（土日重複分は除外済み）"
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
                  helpText="年間の休日出勤日数"
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
        </main>
      </div>
    </div>
  )
}
