import { HolidayCalculator } from "@/components/holiday-calculator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InfoIcon } from "lucide-react"

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">年間休日計算ツール</h1>
      <p className="text-center text-muted-foreground mb-8">勤務日数と休日から年間の休日数を簡単に計算できます</p>

      <div className="max-w-2xl mx-auto">
        <HolidayCalculator />

        <div className="mt-8 flex justify-center">
          <Link href="/about">
            <Button variant="outline" className="flex items-center gap-2">
              <InfoIcon className="h-4 w-4" aria-hidden="true" />
              このツールについて詳しく見る
            </Button>
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© {currentYear} 年間休日計算ツール</p>
      </footer>
    </main>
  )
}

