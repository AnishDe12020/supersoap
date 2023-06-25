"use client"

import { useMemo, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import { Network } from "database"
import { WalletIcon } from "lucide-react"
import Lottie from "react-lottie-player"
import { toast } from "sonner"

import successAnimation from "../public/success.json"
import { ConnectWallet } from "./ConnectWallet"
import { Icons } from "./icons"
import { Button } from "./ui/button"

interface ClaimCardProps {
  id: string
  active: boolean
  network: Network
}

enum Status {
  IDLE,
  CLAIMING,
  CLAIMED_WALLET,
}

const ClaimCard = ({ id, active, network }: ClaimCardProps) => {
  const { publicKey } = useWallet()

  const [status, setStatus] = useState<Status>(Status.IDLE)
  const [claimSignature, setClaimSignature] = useState<string>("")

  const isMobile = useMemo(() => {
    if (!navigator) {
      return false
    }

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

    const {
      data: { txSignature },
    } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/drops/${id}/mint`,
      {
        claimerAddress: publicKey.toBase58(),
      }
    )

    setClaimSignature(txSignature)

    setStatus(Status.CLAIMED_WALLET)
  }

  return active ? (
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
              window.open(
                `https://solscan.io/tx/${claimSignature}?cluster=${
                  network === "MAINNET" ? "mainnet-beta" : "devnet"
                }`,
                "_blank"
              )
            }}
            className="bg-green-700 hover:bg-green-800"
          >
            View Transaction
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-4 mt-8">
      <p>
        This drop is not active. Please check back later or contact the creator
      </p>
    </div>
  )
}

export default ClaimCard
