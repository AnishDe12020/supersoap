import { prisma } from "@/lib/db"
import ClaimCard from "@/components/ClaimCard"

interface ClaimPageProps {
  params: {
    id: string
  }
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
  const drop = await prisma.drop.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!drop) {
    return {
      notFound: true,
    }
  }

  return (
    <div className="relative flex flex-col items-center w-full mt-8 isolate">
      <div className="p-4 bg-secondary rounded-xl max-w-300 max-h-300">
        <img src={drop.imageUri} height={200} width={200} />
      </div>

      <div className="flex flex-col items-center w-full mt-8">
        <h1 className="text-3xl font-bold">{drop.name}</h1>
        <p className="mt-2 text-sm text-gray-400">{drop.description}</p>

        <div className="flex flex-wrap max-w-xl gap-2 mt-6">
          {drop.attributes.map((attribute, index) => (
            <div
              key={index}
              className="flex-col gap-2 p-2 rounded-lg bg-secondary"
            >
              <p className="text-sm text-gray-400">{attribute.trait_type}</p>

              <p className="text-sm font-semibold">{attribute.value}</p>
            </div>
          ))}
        </div>

        <ClaimCard id={drop.id} active={drop.active} network={drop.network} />
      </div>
    </div>
  )
}

export default ClaimPage
