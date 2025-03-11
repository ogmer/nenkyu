"use client"

import { Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"

interface SocialShareProps {
  holidayCount: number
}

export function SocialShare({ holidayCount }: SocialShareProps) {
  const [url, setUrl] = useState("")

  // Get the current URL on the client side
  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const shareText = `私の年間休日数は${holidayCount}日です！あなたの年間休日数はいくつ？ #年間休日計算ツール`

  const handleTwitterShare = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }, [shareText, url])

  const handleFacebookShare = useCallback(() => {
    // Facebook uses 'quote' parameter for the text that appears in the share dialog
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`
    window.open(facebookUrl, "_blank", "noopener,noreferrer")
  }, [shareText, url])

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <p className="text-sm text-muted-foreground mb-3">結果をシェアする:</p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-[#1DA1F2] text-white hover:bg-[#1a94df] hover:text-white border-[#1DA1F2]"
          aria-label="Twitterでシェア"
        >
          <Twitter className="h-4 w-4" aria-hidden="true" />
          <span>Twitter</span>
        </Button>
        <Button
          onClick={handleFacebookShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#166fe5] hover:text-white border-[#1877F2]"
          aria-label="Facebookでシェア"
        >
          <Facebook className="h-4 w-4" aria-hidden="true" />
          <span>Facebook</span>
        </Button>
      </div>
    </div>
  )
}

