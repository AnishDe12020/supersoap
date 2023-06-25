"use client"

import { RefObject, useEffect, useRef } from "react"
import { createQR } from "@/utils/qr"
import { TabsContent } from "@radix-ui/react-tabs"
import html2canvas from "html2canvas"
import {
  ClipboardCopyIcon,
  CopyIcon,
  ExternalLinkIcon,
  QrCodeIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { QRCode } from "./QRCode"
import { Badge } from "./ui/badge"
import { Button, buttonVariants } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Switch } from "./ui/switch"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

interface DropCardProps {
  drop: any
}

const DropCard = ({ drop }: DropCardProps) => {
  const linkQRRef = useRef<HTMLDivElement>(null)
  const solanaPayQRRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-2/3 p-4 rounded-xl bg-card border-1px border-secondary">
      <div className="flex flex-col gap-6 md:flex-row">
        <img src={drop.imageUri} alt={drop.name} className="rounded-xl" />
        <div className="flex flex-col justify-between w-full gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-2xl font-bold">{drop.name}</h3>

              <p className="text-xs text-gray-500 md:text-sm">
                {drop.minted} of {drop.size} minted
              </p>
            </div>
            <p className="text-sm text-gray-400">{drop.description}</p>
          </div>

          <div className="flex flex-col gap-6 md:justify-between md:flex-row">
            <div className="flex items-center gap-2">
              {drop.active ? (
                <Badge variant="green">Active</Badge>
              ) : (
                <Badge variant="red">Inactive</Badge>
              )}
              <Switch
                checked={true}
                onCheckedChange={() => {
                  console.log("TODO: implement toggle")
                  toast.promise(() => Promise.resolve(), {
                    loading: drop.active ? "Deactivating" : "Activating",
                    success: drop.active ? "Deactivated" : "Activated",
                    error: drop.active
                      ? "Failed to deactivate"
                      : "Failed to activate",
                  })
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <QrCodeIcon className="w-4 h-4 mr-2" />
                    <span>QR Code</span>
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Drop QR Code</DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="link" className="w-full">
                    <TabsList className="w-full my-4">
                      <TabsTrigger value="link">Link</TabsTrigger>
                      <TabsTrigger value="solana-pay">Solana Pay</TabsTrigger>
                    </TabsList>

                    <TabsContent value="link">
                      <p className="mb-4 text-sm text-gray-300">
                        A link anyone can visit and connect their wallet or
                        claim the NFT with 1 click using Solana Pay if on mobile
                      </p>

                      <QRCode
                        content={`${window.location.origin}/drops/claim/${drop.id}`}
                        ref={linkQRRef}
                      />
                    </TabsContent>

                    <TabsContent value="solana-pay">
                      <p className="mb-4 text-sm text-gray-300">
                        A QR code that can directly be scanned with a Solana Pay
                        enabled wallet to claim the NFT
                      </p>

                      <QRCode
                        content={`${process.env.NEXT_PUBLIC_BACKEND_URL}/drops/solana-pay/${drop.id}`}
                        ref={solanaPayQRRef}
                      />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/drops/claim/${drop.id}`
                  )
                  toast.success("Copied to clipboard")
                }}
                className="w-full md:w-fit"
              >
                <span>Copy URL</span>
                <CopyIcon className="w-4 h-4 ml-2" />
              </Button>

              <a
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full md:w-fit"
                )}
                href={`${window.location.origin}/drops/claim/${drop.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-sm">Open</span>
                <ExternalLinkIcon className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropCard
