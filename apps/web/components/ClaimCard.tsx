"use client"

import { useMemo, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletIcon } from "lucide-react"
import { toast } from "sonner"

import { ConnectWallet } from "./ConnectWallet"
import { Icons } from "./icons"
import { Button } from "./ui/button"

interface ClaimCardProps {
  id: string
}

enum Status {
  IDLE,
  CLAIMING,
  CLAIMED_WALLET,
}

const ClaimCard = ({ id }: ClaimCardProps) => {
  const { publicKey } = useWallet()

  const [status, setStatus] = useState<Status>(Status.IDLE)
  const [claimSignature, setClaimSignature] = useState<string>("")

  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  const handleWalletClaim = async () => {
    setStatus(Status.CLAIMING)

    if (!publicKey) {
      toast.error("Please connect a wallet")
      return
    }

    // call api to claim

    setStatus(Status.CLAIMED_WALLET)
  }

  return (
    <div className="flex flex-col gap-4 p-4 mt-8 bg-card rounded-xl">
      {status === Status.IDLE && (
        <>
          {publicKey ? (
            <Button onClick={handleWalletClaim}>
              <WalletIcon className="w-6 h-6 mr-2" />
              <span>Claim to connected Solana Wallet</span>
            </Button>
          ) : (
            <ConnectWallet onlyConnect>
              <WalletIcon className="w-6 h-6 mr-2" />
              <span>Connect Solana Wallet and Claim</span>
            </ConnectWallet>
          )}

          {isMobile && (
            <Button className="flex items-center text-white bg-black hover:bg-slate-800">
              <span>Claim using </span>
              <Icons.solanapay className="w-10 h-6 ml-2" />
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default ClaimCard
