import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import { ConnectWallet } from "@/components/ConnectWallet"
import CreateDropDialog from "@/components/CreateDropDialog"
import DropCard from "@/components/DropCard"

const drops = [
  {
    name: "Drop 1",
    description: "Drop 1 description",
    imageUri: "https://via.placeholder.com/150",
    size: 10,
    active: true,
    minted: 5,
    metadataUri: "https://arweave.net/123",
    enabled: true,
  },
]

const DashboardPage = async () => {
  const session = await getServerSession(authOptions as any)

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {session ? <CreateDropDialog /> : <ConnectWallet />}

      <div className="flex flex-col gap-4 mt-16 w-full items-center">
        {drops.map((drop, index) => (
          <DropCard key={index} drop={drop} />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
