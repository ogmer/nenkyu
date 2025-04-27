import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center pl-4">
          <Link href="/" className="font-semibold text-lg hover:text-primary transition-colors">
            年間休日計算ツール
          </Link>
        </div>
        <div className="flex items-center pr-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
