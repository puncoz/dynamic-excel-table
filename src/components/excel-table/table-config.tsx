import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
import useSheetStoreComputed from "@/hooks/sheet-store"
import { useAppStore } from "@/store/store"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { FunctionComponent, useCallback, useState } from "react"
import { FaTools } from "react-icons/fa"

const TableConfig: FunctionComponent = () => {
  const activeSheet = useAppStore(state => state.activeSheet)
  const setSelectedColumns = useAppStore(state => state.setSelectedColumns)
  const { getSelectedColumns, getHeaders } = useSheetStoreComputed()
  const [selected, setSelected] = useState<string[]>(getSelectedColumns())

  const handleOnChange = useCallback((name: string, checked: CheckedState) => {
    if (checked) {
      setSelected(prev => [...prev, name])
    } else {
      setSelected(prev => prev.filter(item => item !== name))
    }
  }, [])

  const handleOnClearAll = useCallback(() => {
    setSelected([])
  }, [])

  const handleOnSelectAll = useCallback(() => {
    setSelected(getHeaders() || [])
  }, [getHeaders])

  const handleOnOpenChange = useCallback(() => {
    setSelected(getSelectedColumns())
  }, [getSelectedColumns])

  const handleOnSave = useCallback(() => {
    setSelectedColumns(activeSheet || "", selected)
  }, [activeSheet, selected, setSelectedColumns])

  return (
    <Sheet onOpenChange={handleOnOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <FaTools/>
        </Button>
      </SheetTrigger>

      <SheetContent className="gap-0">
        <SheetHeader className="pb-0">
          <SheetTitle>Table Config</SheetTitle>
          <SheetDescription>
            Select columns to show or hide in the table view
          </SheetDescription>

          <div className="flex justify-end">
            <Button variant="link" onClick={handleOnSelectAll}>Select All</Button>
            <Button variant="link" className="hover:text-red-500" onClick={handleOnClearAll}>Clear All</Button>
          </div>
        </SheetHeader>

        <div className="overflow-auto border-t">
          {getHeaders()?.map(header => (
            <Label key={header}
                   className="px-4 py-2 border-b border-gray-200">
              <Checkbox checked={selected.includes(header)}
                        onCheckedChange={(checked) => handleOnChange(header, checked)}/>
              {header}
            </Label>
          ))}
        </div>

        <SheetFooter className="grid grid-cols-2">
          <SheetClose asChild className="cursor-pointer block">
            <Button variant="secondary" className="w-full">Cancel</Button>
          </SheetClose>

          <SheetClose asChild className="cursor-pointer block">
            <Button className="w-full"
                    disabled={selected.length === 0}
                    onClick={handleOnSave}>Apply</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default TableConfig


