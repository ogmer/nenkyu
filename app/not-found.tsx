import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-6 mt-2 text-lg text-muted-foreground">ページが見つかりませんでした。</p>
        <Link href="/">
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            トップページに戻る
          </Button>
        </Link>
      </div>
    </div>
  )
}

