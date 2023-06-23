"use client"

import { ClipboardCopyIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Badge } from "./ui/badge"
import { Button, buttonVariants } from "./ui/button"
import { Switch } from "./ui/switch"

interface DropCardProps {
  drop: any
}

const DropCard = ({ drop }: DropCardProps) => {
  return (
    <div className="rounded-xl p-4 bg-secondary border-1px border-secondary w-2/3">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={drop.imageUri} alt={drop.name} className="rounded-xl" />
        <div className="flex flex-col gap-6 justify-between w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full items-center">
              <h3 className="font-bold text-2xl">{drop.name}</h3>

              <p className="text-gray-500 text-xs md:text-sm">
                {drop.minted} of {drop.size} minted
              </p>
            </div>
            <p className="text-gray-400 text-sm">{drop.description}</p>
          </div>

          <div className="flex gap-6 md:justify-between flex-col md:flex-row">
            <div className="flex gap-2 items-center">
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

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/drops/${drop.id}`
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
                href={`${window.location.origin}/drops/${drop.id}`}
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
