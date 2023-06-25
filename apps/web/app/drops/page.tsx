import { authOptions } from "@/pages/api/auth/[...nextauth]"
import axios from "axios"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/db"
import { ConnectWallet } from "@/components/ConnectWallet"
import CreateDropDialog from "@/components/CreateDropDialog"
import DropCard from "@/components/DropCard"

// const drops = [
//   {
//     name: "Drop 1",
//     description: "Drop 1 description",
//     imageUri: "https://via.placeholder.com/150",
//     size: 10,
//     active: true,
//     minted: 5,
//     metadataUri: "https://arweave.net/123",
//     enabled: true,
//   },
// ]

const DropsPage = async () => {
  const session = await getServerSession(authOptions as any)

  const drops = await prisma.drop.findMany({
    where: {
      owner: {
        address: (session as any)?.user?.name,
      },
    },
  })

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {session ? <CreateDropDialog /> : <ConnectWallet />}

      <div className="flex flex-col items-center w-full gap-4 mt-16">
        {drops.length > 0 ? (
          drops.map((drop, index) => <DropCard key={index} drop={drop} />)
        ) : (
          <p className="text-gray-300">
            No drops yet. Create one by clicking on the button above
          </p>
        )}
      </div>
    </div>
  )
}

export default DropsPage
