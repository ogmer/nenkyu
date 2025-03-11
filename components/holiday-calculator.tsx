"use client"
import { Calendar } from "lucide-react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { SocialShare } from "./social-share"
import { useMemo, useState, useEffect } from "react"

// Custom hook to handle input values that can be empty strings
function useNumberInput(key: string, initialValue: number) {
  const [value, setValue] = useLocalStorage<string | number>(key, initialValue)
  const [localValue, setLocalValue] = useState(initialValue.toString())

  useEffect(() => {
    if (typeof value === "number") {
      setLocalValue(value.toString())
    } else if (typeof value === "string") {
      setLocalValue(value)
    }
  }, [value])

  // Convert to number for calculations (empty string becomes 0)
  const numericValue = localValue === "" ? 0 : Number(localValue)

  return [localValue, numericValue, setValue] as const
}

export function HolidayCalculator() {
  // Use localStorage to persist user inputs
  const [workingDays, setWorkingDays] = useLocalStorage("workingDays", 5)
  const [nationalHolidays, nationalHolidaysNum, setNationalHolidays] = useNumberInput("nationalHolidays", 14)
  const [yearEndHolidays, yearEndHolidaysNum, setYearEndHolidays] = useNumberInput("yearEndHolidays", 5)
  const [summerHolidays, summerHolidaysNum, setSummerHolidays] = useNumberInput("summerHolidays", 3)
  const [specialHolidays, specialHolidaysNum, setSpecialHolidays] = useNumberInput("specialHolidays", 0)
  const [overtimeWorkDays, overtimeWorkDaysNum, setOvertimeWorkDays] = useNumberInput("overtimeWorkDays", 0)

  // Memoize the calculation to avoid unnecessary recalculations
  const annualHolidays = useMemo(() => {
    // 週末の日数を計算
    const weekendDays = 52 * (7 - workingDays)

    // 祝日と各種休暇の合計 (重複を考慮しない簡易計算)
    const totalSpecialHolidays = nationalHolidaysNum + yearEndHolidaysNum + summerHolidaysNum + specialHolidaysNum

    // 年間休日 = 週末 + 祝日 + 各種休暇 - 休日出勤日数
    return weekendDays + totalSpecialHolidays - overtimeWorkDaysNum
  }, [workingDays, nationalHolidaysNum, yearEndHolidaysNum, summerHolidaysNum, specialHolidaysNum, overtimeWorkDaysNum])

  // Handler for number input changes
  const handleInputChange = (setter: (value: string) => void, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty string or valid numbers
    if (value === "" || /^\d*$/.test(value)) {
      setter(value)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" aria-hidden="true" />
          年間休日計算
        </CardTitle>
        <CardDescription>勤務日数と休日から年間の休日数を計算します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="workingDays">週の勤務日数</Label>
            <Select value={workingDays.toString()} onValueChange={(value) => setWorkingDays(Number.parseInt(value))}>
              <SelectTrigger id="workingDays">
                <SelectValue placeholder="週の勤務日数を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5日（月〜金）</SelectItem>
                <SelectItem value="6">6日（月〜土）</SelectItem>
                <SelectItem value="4">4日（週4日勤務）</SelectItem>
                <SelectItem value="3">3日（週3日勤務）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nationalHolidays">祝日数</Label>
            <Input
              id="nationalHolidays"
              type="text"
              inputMode="numeric"
              value={nationalHolidays}
              onChange={(e) => handleInputChange(setNationalHolidays, e)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">日本の祝日は平均16日です (土曜の重なりが2日程度)</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="yearEndHolidays">年末年始休暇</Label>
            <Input
              id="yearEndHolidays"
              type="text"
              inputMode="numeric"
              value={yearEndHolidays}
              onChange={(e) => handleInputChange(setYearEndHolidays, e)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">12月29日〜1月3日の場合は6日など (元旦を除き5日)</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="summerHolidays">夏季休暇</Label>
            <Input
              id="summerHolidays"
              type="text"
              inputMode="numeric"
              value={summerHolidays}
              onChange={(e) => handleInputChange(setSummerHolidays, e)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">お盆期間などの夏季特別休暇 (平均は3～4日)</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialHolidays">特別休暇</Label>
            <Input
              id="specialHolidays"
              type="text"
              inputMode="numeric"
              value={specialHolidays}
              onChange={(e) => handleInputChange(setSpecialHolidays, e)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">創立記念日など、その他の特別休暇</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="overtimeWorkDays">休日出勤日数</Label>
            <Input
              id="overtimeWorkDays"
              type="text"
              inputMode="numeric"
              value={overtimeWorkDays}
              onChange={(e) => handleInputChange(setOvertimeWorkDays, e)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">土日祝日の出勤や振替休日なしの勤務日数等</p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <Label className="text-lg">あなたの年間休日数は</Label>
          <div className="text-5xl font-bold mt-2" aria-live="polite">
            {annualHolidays}
            <span className="text-2xl ml-1">日</span>
          </div>

          <SocialShare holidayCount={annualHolidays} />
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>※ この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</p>
          <p>※ より正確な計算には、実際のカレンダーを参照してください。</p>
        </div>
      </CardContent>
    </Card>
  )
}

