import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">年間休日計算ツール</h1>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">このツールについて</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">年間休日計算ツールとは</h3>
                <p className="text-gray-700 leading-relaxed">
                  このツールは、勤務日数と各種休日から年間の休日数を簡単に計算できるWebアプリケーションです。企業の年間休日数の目安の確認や、転職先の休日数の比較などにご活用いただけます。
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">計算方法</h3>
                <p className="text-gray-700 mb-4">年間休日数は以下の計算式で算出しています：</p>

                <div className="mb-4">
                  <span className="inline-block bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">
                    年間休日数 = 週末の日数 + 祝日数 + 年末年始休暇 + 夏季休暇 + 特別休暇 - 休日出勤日数
                  </span>
                </div>

                <p className="text-gray-700 mt-4 leading-relaxed">
                  週末の日数は、週の勤務日数から自動計算されます（例：週5日勤務の場合、週末は2日×52週=104日）。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせ</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-700 mb-4">
                ツールに関するご質問やご要望がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">連絡先:</span>
                <a href="mailto:ogmer.net@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                  ogmer.net@gmail.com
                </a>
              </div>
            </div>
          </section>

          <div className="text-center pt-8">
            <Link href="/">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">計算ツールに戻る</Button>
            </Link>
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 mt-12">© 2025 年間休日計算ツール</footer>
      </div>
    </div>
  )
}
