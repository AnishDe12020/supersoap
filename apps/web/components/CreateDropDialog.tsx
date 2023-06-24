"use client"

import { useEffect, useState } from "react"
import { calculateClosestTreeDepth } from "@/utils/compression"
import { zodResolver } from "@hookform/resolvers/zod"
import { getConcurrentMerkleTreeAccountSize } from "@solana/spl-account-compression"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js"
import { useSession } from "next-auth/react"
import Dropzone, { FileRejection } from "react-dropzone"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import AttributesInput from "./AttributesInput"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const createDropFormSchema = z.object({
  dropName: z.string(),
  dropDescription: z.string().optional(),
  dropSize: z.number().min(1),
  externalUrl: z
    .string()
    .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
    .optional(),
  network: z.enum(["devnet"]),
  image: z.instanceof(File),
  attributes: z.any(),
})

const MAX_FILE_SIZE = 5_24_49_280

const CreateDropDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)

  const { data: user } = useSession()

  const { publicKey } = useWallet()

  const { connection: mainConnection } = useConnection()

  const wallet = useWallet()

  const form = useForm<z.infer<typeof createDropFormSchema>>({
    resolver: zodResolver(createDropFormSchema),
    defaultValues: {
      network: "devnet",
    },
  })

  const [isCreatingDrop, setIsCreatingDrop] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data)

    setIsCreatingDrop(true)

    if (!wallet.publicKey) {
      console.error("public key is not defined")
      return
    }

    const depth = calculateClosestTreeDepth(data.dropSize)

    const requiredSpace = getConcurrentMerkleTreeAccountSize(
      depth.sizePair.maxDepth,
      depth.sizePair.maxBufferSize,
      depth.canopyDepth
    )

    const connection = new Connection(
      data.network === "devnet"
        ? "https://api.devnet.solana.com"
        : process.env.NEXT_PUBLIC_MAINNET_RPC!
    )

    const estimatedCostForTree =
      (await connection.getMinimumBalanceForRentExemption(requiredSpace)) /
      LAMPORTS_PER_SOL
    const txCost = data.dropSize * 0.000005
    const totalWithoutPadding = estimatedCostForTree + txCost
    const padding = totalWithoutPadding * 0.05
    const totalCost = totalWithoutPadding + padding

    const transferIx = SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(process.env.NEXT_PUBLIC_VAULT_PUBLIC_KEY!),
      lamports: Math.ceil(totalCost * LAMPORTS_PER_SOL),
    })

    const transferTx = new Transaction().add(transferIx)

    const latestBlockhash = await connection.getLatestBlockhash()

    const depositSig = await wallet.sendTransaction(transferTx, connection)

    await connection.confirmTransaction(
      {
        signature: depositSig,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "processed"
    )

    // call api

    toast.success("Drop created successfully", {
      action: {
        label: "View Deposit Transaction",
        onClick: () => {
          window.open(`https://solscan.io/tx/${depositSig}`, "_blank")
        },
      },
    })

    setIsCreatingDrop(false)
  })

  const size = form.watch("dropSize", 0)

  useEffect(() => {
    async function calculateCost() {
      const depth = calculateClosestTreeDepth(size)

      const requiredSpace = getConcurrentMerkleTreeAccountSize(
        depth.sizePair.maxDepth,
        depth.sizePair.maxBufferSize,
        depth.canopyDepth
      )

      const estimatedCostForTree =
        (await mainConnection.getMinimumBalanceForRentExemption(
          requiredSpace
        )) / LAMPORTS_PER_SOL

      const txCost = size * 0.000005

      const totalWithoutPadding = estimatedCostForTree + txCost
      const padding = totalWithoutPadding * 0.05
      const total = totalWithoutPadding + padding

      setEstimatedCost(total)
    }

    calculateCost()
  }, [size])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create new drop</Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-auto h-[32rem]">
        <DialogHeader>
          <DialogTitle>Create Drop</DialogTitle>
          <DialogDescription>
            Create a new compressed NFT Drop
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="dropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The name of your SOAP Drop</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dropDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional description of your SOAP Drop
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dropSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Collection size</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>
                    The number of NFTs in your collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional external URL that will be displayed on your drop
                    page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AttributesInput control={form.control} name="attributes" />

            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>

                      <SelectContent>
                        {/* <SelectItem value="mainnet-beta">Mainnet</SelectItem> */}
                        <SelectItem value="devnet">Devnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The network of your collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Image</FormLabel>
                  <FormDescription>
                    The image for you NFT Collection
                  </FormDescription>
                  <FormControl>
                    <Dropzone
                      onDropAccepted={(acceptedFiles) => {
                        field.onChange(acceptedFiles[0])
                      }}
                      onDropRejected={(fileRejections: FileRejection[]) => {
                        toast.error(fileRejections[0].errors[0].message)
                      }}
                      accept={{
                        "image/*": ["*"],
                      }}
                      maxSize={MAX_FILE_SIZE}
                    >
                      {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                          {...getRootProps()}
                          className="flex flex-col items-center justify-center w-full gap-4 p-4 text-center transition duration-150 border-2 border-gray-700 border-dashed cursor-pointer rounded-xl hover:border-gray-500"
                        >
                          <input {...getInputProps()} />

                          {isDragActive ? (
                            <p>Drop here</p>
                          ) : field.value ? (
                            <div className="flex flex-col items-center justify-center w-full gap-4">
                              <img src={URL.createObjectURL(field.value)} />
                              <p>{field.value.name}</p>
                            </div>
                          ) : (
                            <p>
                              Drag and drop the image for the NFT here or click
                              to select the file
                            </p>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="items-center gap-6 mt-6 text-center sm:flex-col-reverse">
              <p className="w-64 text-xs text-gray-400">
                It will cost ~{estimatedCost.toFixed(4)} SOL to create this
                drop. This includes the cost of the NFTs and the transaction
                fees.
              </p>

              <Button
                isLoading={isCreatingDrop}
                type="submit"
                className="w-fit"
              >
                Create Drop
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDropDialog
