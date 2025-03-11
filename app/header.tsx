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
        <div className="flex items-center gap-6 pr-4">
          <nav>
            <Link href="/about" className="transition-colors hover:text-primary px-3 py-2 rounded-md hover:bg-muted/50">
              このツールについて
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

