"use server"

import { z } from "zod"

// バリデーションスキーマ: 祝日データの形式を検証
const HolidayDataSchema = z.record(z.string(), z.string())

/**
 * Server Actionで祝日データを取得（セキュアなAPI呼び出し）
 * @param year 取得する年
 * @returns 平日の祝日数、またはnull（エラー時）
 */
export async function fetchHolidaysData(year: number) {
  // 年の妥当性チェック
  if (year < 2000 || year > 2100) {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      // キャッシュ設定: 1時間
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const validatedData = HolidayDataSchema.parse(data)

    // 安全に処理: 平日の祝日のみカウント
    const weekdayHolidays = Object.keys(validatedData).reduce((count, dateString) => {
      try {
        const date = new Date(dateString)
        // 有効な日付かチェック
        if (isNaN(date.getTime())) return count

        const dayOfWeek = date.getDay()
        // 土日以外をカウント
        return dayOfWeek !== 0 && dayOfWeek !== 6 ? count + 1 : count
      } catch {
        return count
      }
    }, 0)

    // 範囲制限: 0～50日
    return Math.max(0, Math.min(50, weekdayHolidays))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid holiday data format:", error)
    } else if (error.name !== "AbortError") {
      console.error("Failed to fetch holidays:", error)
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}
