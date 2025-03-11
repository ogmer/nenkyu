import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "このツールについて | 年間休日計算ツール",
  description: "年間休日計算ツールの使い方と計算方法について説明します。",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            トップに戻る
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-6">このツールについて</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">年間休日計算ツールとは</h2>
            <p>
              このツールは、勤務日数と各種休日から年間の休日数を簡単に計算できるウェブアプリケーションです。
              企業の年間休日数の確認や、転職先の休日数の比較などにご活用いただけます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">計算方法</h2>
            <p>年間休日数は以下の計算式で算出しています：</p>
            <div className="bg-muted p-4 rounded-md my-3">
              <p className="font-mono">
                年間休日数 = 週末の日数 + 祝日数 + 年末年始休暇 + 夏季休暇 + 特別休暇 - 休日出勤日数
              </p>
            </div>
            <p>週末の日数は、週の勤務日数から自動計算されます（例：週5日勤務の場合、週末は2日×52週=104日）。</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">注意事項</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</li>
              <li>より正確な計算には、実際のカレンダーを参照してください。</li>
              <li>入力したデータはお使いのブラウザに保存されます（他のデバイスやブラウザには同期されません）。</li>
              <li>お問い合わせ等、なにかありましたら ogmer.net[at]gmail.com まで</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Link href="/">
            <Button className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              計算ツールに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

