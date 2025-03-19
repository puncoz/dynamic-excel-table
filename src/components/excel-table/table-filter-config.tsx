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
import { CiFilter } from "react-icons/ci"
import { FaMinus, FaPlus } from "react-icons/fa6"
import { z } from "zod"

const FormSchema = z.object({
  searchEnabled: z.boolean().default(false),
  searchField: z.string().optional().default(""),
  filters: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (data.searchEnabled && !data.searchField) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Search field is required",
      path: ["searchField"],
    })
  }
})

const TableFilterConfig: FunctionComponent = () => {
  const activeSheet = useAppStore(state => state.activeSheet)
  const setFilters = useAppStore(state => state.setFilters)
  const { getHeaders, getFilters } = useSheetStoreComputed()

  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchEnabled: getFilters()?.searchEnabled || false,
      searchField: getFilters()?.searchField || "",
      filters: getFilters()?.filters || [],
    },
  })

  const searchEnabled = useWatch({ control: form.control, name: "searchEnabled" })
  // @ts-expect-error name is required
  const filters = useFieldArray({ control: form.control, name: "filters" })

  const toggleOpen = useCallback(() => {
    setIsOpen(state => !state)
  }, [])

  const handleOnSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
    setFilters(activeSheet || "", {
      searchEnabled: data.searchEnabled,
      searchField: data.searchEnabled ? data.searchField : "",
      filters: data.filters,
    })

    setIsOpen(false)
  }, [activeSheet, setFilters])

  return (
    <Sheet open={isOpen} onOpenChange={toggleOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="justify-start">
          <CiFilter/> Filter config
        </Button>
      </SheetTrigger>

      <Form {...form}>
        <SheetContent className="gap-0">
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col h-full">
            <SheetHeader className="pb-4">
              <SheetTitle>Table Config &raquo; Filter config</SheetTitle>
              <SheetDescription>
                Configure filters parameters and actions
              </SheetDescription>
            </SheetHeader>

            <div className="overflow-auto border-t">
              {/*search filter*/}
              <div className="space-y-4 border-b p-4">
                <FormField control={form.control}
                           name="searchEnabled"
                           render={({ field }) => (
                             <FormItem
                               className={cn(
                                 "flex flex-row items-center justify-between",
                                 searchEnabled && "pb-0",
                               )}>
                               <div className="space-y-1">
                                 <FormLabel className="font-semibold">Search filter enabled?</FormLabel>
                                 <FormDescription className="text-xs">
                                   Enable or disable the search filter
                                 </FormDescription>
                               </div>
                               <FormControl>
                                 <Switch checked={field.value} onCheckedChange={field.onChange}/>
                               </FormControl>
                               <FormMessage/>
                             </FormItem>
                           )}/>

                {searchEnabled && (
                  <FormField control={form.control}
                             name="searchField"
                             render={({ field }) => (
                               <FormItem className="flex flex-col justify-between pt-1">
                                 <div className="space-y-1">
                                   <FormLabel className="font-normal">Search field:</FormLabel>
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
                                 <FormMessage/>
                               </FormItem>
                             )}/>
                )}
              </div>

              {/*dynamic filters*/}
              <div className="space-y-4 border-b p-4">
                <div className="flex flex-row justify-between items-center">
                  <div className="space-y-1">
                    <FormLabel className="font-semibold">Select filters</FormLabel>
                    <FormDescription className="text-xs">
                      Add filters columns to the table
                    </FormDescription>
                  </div>
                  <Button variant="outline" size="icon" type="button" onClick={() => filters.append("")}>
                    <FaPlus className="size-4"/>
                  </Button>
                </div>

                {filters.fields.map((field, index) => (
                  <FormField key={field.id}
                             control={form.control}
                             name={`filters.${index}`}
                             render={({ field }) => (
                               <FormItem className="flex flex-col justify-between pt-1">
                                 <div className="flex flex-row justify-between gap-2">
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
                                   <Button variant="outline" size="icon" type="button"
                                           className="text-red-500 border-red-500"
                                           onClick={() => filters.remove(index)}>
                                     <FaMinus className="size-4"/>
                                   </Button>
                                 </div>
                                 <FormMessage/>
                               </FormItem>
                             )}/>
                ))}
              </div>
            </div>

            <SheetFooter className="grid grid-cols-2">
              <SheetClose asChild className="cursor-pointer block">
                <Button variant="secondary" className="w-full">Cancel</Button>
              </SheetClose>

              <Button className="w-full" type="submit">Apply</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  )
}

export default TableFilterConfig
