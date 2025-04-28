"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値を同期的に取得する関数
  const getInitialValue = (): T => {
    // ブラウザ環境でない場合は初期値を返す
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      // ローカルストレージから値を取得
      const item = window.localStorage.getItem(key)
      // 値が存在する場合はパースして返す、存在しない場合は初期値を返す
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // エラーが発生した場合は初期値を返す
      console.error("Error reading from localStorage:", error)
      return initialValue
    }
  }

  // 状態を初期化（同期的に初期値を設定）
  const [value, setValue] = useState<T>(getInitialValue)

  // 値が変更されたらローカルストレージに保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }, [key, value])

  return { value, setValue }
}
