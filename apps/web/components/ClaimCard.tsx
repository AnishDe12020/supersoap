"use client"

import { useMemo, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { CheckCircle2Icon, WalletIcon } from "lucide-react"
import Lottie from "react-lottie-player"
import { toast } from "sonner"

import successAnimation from "../public/success.json"
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
    <div className="flex flex-col gap-4 mt-8">
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

      {status === Status.CLAIMING && (
        <div className="flex flex-col items-center justify-center gap-6 mt-4 text-center">
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          <span>Claiming...</span>
        </div>
      )}

      {status === Status.CLAIMED_WALLET && (
        <div className="flex flex-col items-center justify-center gap-6 mt-4 text-center">
          <Lottie
            animationData={successAnimation}
            play
            loop={false}
            style={{
              width: 100,
              height: 100,
            }}
          />

          <Button
            onClick={() => {
              window.open(`https://solscan.io/tx/${claimSignature}`, "_blank")
            }}
            className="bg-green-700 hover:bg-green-800"
          >
            View Transaction
          </Button>
        </div>
      )}
    </div>
  )
}

export default ClaimCard
