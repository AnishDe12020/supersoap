import { CrossIcon, PlusIcon, XIcon } from "lucide-react"
import { Control, useFieldArray } from "react-hook-form"

import { Button } from "./ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"

interface AttributesInputProps {
  control: Control
  name: string
}

const AttributesInput = ({ control, name }: AttributesInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <>
      <ul className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <FormField
              control={control}
              name={`attributes.${index}.trait_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trait Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`attributes.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => remove(index)}
              className="self-center"
            >
              <XIcon className="w-4 h-4 text-red-600" />
            </Button>
          </li>
        ))}
      </ul>

      <Button
        variant="ghost"
        type="button"
        onClick={() => append({ trait_type: "", value: "" })}
      >
        <PlusIcon className="w-4 h-4" />
        <span>Add Attribute</span>
      </Button>
    </>
  )
}

export default AttributesInput
