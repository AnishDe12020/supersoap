"use client"

import { forwardRef, HTMLAttributes, useEffect, useRef } from "react"
import { createQR } from "@/utils/qr"
import html2canvas from "html2canvas"
import { CopyIcon, DownloadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "./ui/button"

export interface QRCodeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: string | URL
}

const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(
  ({ content }: { content: string | URL }) => {
    const qrRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const qr = createQR(content, 256)

      if (qrRef.current) {
        qrRef.current.innerHTML = ""
        qr.append(qrRef.current)
      }
    }, [content])

    const handleDownloadQR = async () => {
      const element = qrRef.current
      if (!element) return

      element.style.borderRadius = "0"
      const canvas = await html2canvas(element)
      element.style.borderRadius = "16px"

      const data = canvas.toDataURL("image/jpg")
      const link = document.createElement("a")

      if (typeof link.download === "string") {
        link.href = data
        link.download = `qrcode.png`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(data)
      }
    }

    const onCopyQR = async () => {
      const element = qrRef.current
      console.log(element)
      if (!element) return

      element.style.borderRadius = "0"
      const canvas = await html2canvas(element)
      element.style.borderRadius = "16px"

      canvas.toBlob((blob) => {
        if (!blob) return
        const item = new ClipboardItem({ "image/png": blob })
        navigator.clipboard.write([item])
      })

      toast.success("Copied QR code to clipboard")
    }

    return (
      <>
        <div className="flex items-center justify-center">
          <div className="p-4 bg-white rounded-lg w-fit">
            <div ref={qrRef} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <Button onClick={handleDownloadQR}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            <span>Download QR Code</span>
          </Button>

          <Button onClick={onCopyQR}>
            <CopyIcon className="w-4 h-4 mr-2" />
            <span>Copy QR Code</span>
          </Button>
        </div>
      </>
    )
  }
)

QRCode.displayName = "QRCode"

export { QRCode }
