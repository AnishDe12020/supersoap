import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import { ConnectWallet } from "@/components/ConnectWallet"
import CreateDropDialog from "@/components/CreateDropDialog"

const DashboardPage = async () => {
  const session = await getServerSession(authOptions as any)

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {session ? <CreateDropDialog /> : <ConnectWallet />}
    </div>
  )
}

export default DashboardPage
