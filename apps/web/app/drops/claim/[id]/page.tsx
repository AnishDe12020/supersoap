import ClaimCard from "@/components/ClaimCard"

interface ClaimPageProps {
  params: {
    id: string
  }
}

const drop = {
  id: "abcd",
  name: "Drop 1",
  description: "Drop 1 description",
  imageUri: "https://via.placeholder.com/150",
  size: 10,
  active: true,
  minted: 5,
  metadataUri: "https://arweave.net/123",
  enabled: true,
  attributes: [
    {
      trait_type: "Background",
      value: "Red",
    },
    {
      trait_type: "Eyes",
      value: "Blue",
    },
  ],
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
  // get drop from api

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <div className="p-4 bg-secondary rounded-xl max-w-300 max-h-300">
        <img src={drop.imageUri} />
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

        <ClaimCard id={drop.id} />
      </div>
    </div>
  )
}

export default ClaimPage
