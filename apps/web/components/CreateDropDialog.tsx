"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSession } from "next-auth/react"
import Dropzone, { FileRejection } from "react-dropzone"
import { set, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
})

const MAX_FILE_SIZE = 5_24_49_280

const CreateDropDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { data: user } = useSession()

  const { publicKey } = useWallet()

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

    setIsCreatingDrop(false)
  })

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

            <DialogFooter className="mt-6">
              <Button type="submit" isLoading={isCreatingDrop}>
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
