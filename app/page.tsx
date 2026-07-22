import { HolidayCalculatorClient } from "@/components/HolidayCalculatorClient"

// ISR: このページを静的生成し、24時間ごとにバックグラウンドで再生成する
export const revalidate = 86400

const CURRENT_YEAR = new Date().getFullYear()

// サーバー側で今年の平日の祝日数を取得（土日と重なる祝日は除外）
// fetchのrevalidateにより結果はISRキャッシュに保存される
async function getWeekdayHolidayCount(): Promise<number> {
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${CURRENT_YEAR}/date.json`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Record<string, string> = await res.json()

    const weekdayHolidays = Object.keys(data).reduce((count, dateStr) => {
      const day = new Date(dateStr).getDay()
      return day !== 0 && day !== 6 ? count + 1 : count
    }, 0)

    return weekdayHolidays > 0 ? Math.min(50, weekdayHolidays) : 14
  } catch {
    // 取得失敗時は標準値にフォールバック
    return 16
  }
}

export default async function Page() {
  const holidayCount = await getWeekdayHolidayCount()

  return <HolidayCalculatorClient initialHolidayCount={holidayCount} />
}
