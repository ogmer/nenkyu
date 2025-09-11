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
                  このツールは、勤務日数と各種休日から年間の休日数を簡単に計算できるWebアプリケーションです。企業の年間休日数の確認や、転職先の休日数の比較などにご活用いただけます。
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

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">注意事項</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>この計算は簡易的なものです。祝日が週末と重なる場合や、振替休日などは考慮していません。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>より正確な計算には、実際のカレンダーを参照してください。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>入力したデータはお使いのブラウザに保存されます。</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせ</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-700 mb-4">
                ツールに関するご質問やご要望がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">連絡先:</span>
                  <span className="font-medium text-gray-900">ogmer.net@gmail.com</span>
                </div>
                <a
                  href="mailto:ogmer.net@gmail.com?subject=年間休日計算ツールについて"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  メールを送信
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
