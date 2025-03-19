import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import useSheetStoreComputed from "@/hooks/sheet-store"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { FunctionComponent, useCallback, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { FaMinus, FaPlus } from "react-icons/fa6"
import { MdMiscellaneousServices } from "react-icons/md"
import { z } from "zod"

const FormSchema = z.object({
  trafficLightEnabled: z.boolean().default(false),
  trafficLightField: z.string().optional().default(""),
  trafficLightColors: z.array(z.object({
    color: z.string().min(1, "Color is required"),
    value: z.string().min(1, "Value is required"),
  })).default([]),
})

const TableOtherConfig: FunctionComponent = () => {
  const activeSheet = useAppStore(state => state.activeSheet)
  const setOtherConfig = useAppStore(state => state.setOtherConfig)
  const colorOptions = useAppStore(state => state.colorOptions)
  const { getHeaders, getOtherConfig, getOptionsForColumn } = useSheetStoreComputed()

  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      trafficLightEnabled: getOtherConfig()?.trafficLightEnabled || false,
      trafficLightField: getOtherConfig()?.trafficLightField || "",
      trafficLightColors: getOtherConfig()?.trafficLightColors || [],
    },
  })

  const trafficLightEnabled = useWatch({ control: form.control, name: "trafficLightEnabled" })
  const trafficLightField = useWatch({ control: form.control, name: "trafficLightField" })
  const trafficLightColors = useFieldArray({ control: form.control, name: "trafficLightColors" })

  const toggleOpen = useCallback(() => {
    setIsOpen(state => !state)
  }, [])

  const handleOnSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
    setOtherConfig(activeSheet || "", data)
    setIsOpen(false)
  }, [activeSheet, setOtherConfig])

  return (
    <Sheet open={isOpen} onOpenChange={toggleOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="justify-start">
          <MdMiscellaneousServices/> Other config
        </Button>
      </SheetTrigger>

      <Form {...form}>
        <SheetContent className="gap-0">
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col h-full">
            <SheetHeader className="pb-4">
              <SheetTitle>Table Config &raquo; Other</SheetTitle>
              <SheetDescription>
                Various settings and configurations
              </SheetDescription>
            </SheetHeader>

            <div className="overflow-auto border-t">
              {/*traffic light*/}
              <div className="space-y-4 border-b p-3">
                <FormField control={form.control}
                           name="trafficLightEnabled"
                           render={({ field }) => (
                             <FormItem className={cn(
                               "flex flex-row items-center justify-between",
                               trafficLightEnabled && "pb-0",
                             )}>
                               <div className="space-y-1">
                                 <FormLabel>Traffic light</FormLabel>
                                 <FormDescription className="text-xs">
                                   Configure the traffic light
                                 </FormDescription>
                               </div>
                               <FormControl>
                                 <Switch checked={field.value} onCheckedChange={field.onChange}/>
                               </FormControl>
                               <FormMessage/>
                             </FormItem>
                           )}/>

                {trafficLightEnabled && (
                  <>
                    <FormField control={form.control}
                               name="trafficLightField"
                               render={({ field }) => (
                                 <FormItem className="flex flex-col justify-between pt-1">
                                   <div className="space-y-1">
                                     <FormLabel className="font-normal">Traffic light field:</FormLabel>
                                   </div>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                     <FormControl>
                                       <SelectTrigger className="w-full">
                                         <SelectValue placeholder="Select a column"/>
                                       </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                       {getHeaders().map((header) => (
                                         <SelectItem key={header} value={header}>{header}</SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </FormItem>
                               )}/>

                    {trafficLightField && (
                      <>
                        <div className="flex flex-row justify-between items-center pt-1">
                          <div className="space-y-1">
                            <FormLabel className="font-normal">Traffic light colors:</FormLabel>
                            <FormDescription className="text-xs">
                              Add colors and values to the traffic light
                            </FormDescription>
                          </div>
                          <Button variant="outline"
                                  size="icon"
                                  type="button"
                                  onClick={() => trafficLightColors.append({ color: "", value: "" })}>
                            <FaPlus className="size-4"/>
                          </Button>
                        </div>

                        {trafficLightColors.fields.map((fieldItem, index) => (
                          <div key={fieldItem.id} className="flex flex-row gap-2 justify-between">
                            <FormField control={form.control}
                                       name={`trafficLightColors.${index}.color`}
                                       render={({ field }) => (
                                         <FormItem className="w-full">
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger className="w-full">
                                                 <SelectValue placeholder="Select a color"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {Object.entries(colorOptions).map(([colorValue, colorClass]) => (
                                                 <SelectItem key={colorValue}
                                                             value={colorValue}
                                                             className={cn(
                                                               "cursor-pointer",
                                                               colorClass,
                                                             )}>
                                                   <p className="capitalize">{colorValue}</p>
                                                 </SelectItem>
                                               ))}
                                             </SelectContent>
                                           </Select>
                                           <FormMessage/>
                                         </FormItem>
                                       )}/>

                            <FormField control={form.control}
                                       name={`trafficLightColors.${index}.value`}
                                       render={({ field }) => (
                                         <FormItem className="w-full">
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger className="w-full">
                                                 <SelectValue placeholder="Select value"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {getOptionsForColumn(trafficLightField).map((fieldValue) => (
                                                 <SelectItem key={fieldValue}
                                                             value={fieldValue}>{fieldValue}</SelectItem>
                                               ))}
                                             </SelectContent>
                                           </Select>
                                           <FormMessage/>
                                         </FormItem>
                                       )}/>

                            <Button variant="outline" size="icon" type="button"
                                    className="text-red-500 border-red-500"
                                    onClick={() => trafficLightColors.remove(index)}>
                              <FaMinus className="size-4"/>
                            </Button>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <SheetFooter className="grid grid-cols-2">
              <SheetClose asChild className="">
                <Button variant="secondary" type="button">Cancel</Button>
              </SheetClose>

              <Button type="submit">Apply</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  )
}

export default TableOtherConfig
