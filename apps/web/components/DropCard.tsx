"use client"

import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"

interface DropCardProps {
  drop: any
}

const DropCard = ({ drop }: DropCardProps) => {
  return (
    <div className="rounded-xl p-4 bg-secondary border-1px border-secondary w-2/3">
      <div className="flex gap-4">
        <img src={drop.imageUri} alt={drop.name} className="rounded-xl" />
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full items-center">
              <h3 className="font-bold text-2xl">{drop.name}</h3>

              <p className="text-gray-500 text-sm">
                {drop.minted} of {drop.size} minted
              </p>
            </div>
            <p className="text-gray-400 text-sm">{drop.description}</p>
          </div>

          <div className="flex space-x-2 pb-1 items-center">
            {drop.active ? (
              <Badge variant="green">Active</Badge>
            ) : (
              <Badge variant="red">Inactive</Badge>
            )}
            <Switch checked={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropCard
