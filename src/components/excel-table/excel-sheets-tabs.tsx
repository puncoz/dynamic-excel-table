import useSheetStoreComputed from "@/hooks/sheet-store"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import { FunctionComponent, useCallback } from "react"

const ExcelSheetsTabs: FunctionComponent = () => {
  const excelData = useAppStore(state => state.excelData)
  const setActiveSheet = useAppStore(state => state.setActiveSheet)
  const { getActiveSheet } = useSheetStoreComputed()

  const handleTabSelect = useCallback((sheetName: string) => {
    setActiveSheet(sheetName)
  }, [setActiveSheet])

  return (
    <div>
      {excelData?.map(excelSheet => (
        <button key={excelSheet.sheetName}
                className={cn(
                  "px-4 py-2 text-gray-700 border-b-2 cursor-pointer",
                  "hover:border-blue-300",
                  excelSheet.sheetName === getActiveSheet() && "border-blue-500 hover:border-blue-500",
                )}
                onClick={() => handleTabSelect(excelSheet.sheetName)}>
          {excelSheet.sheetName}
        </button>
      ))}
    </div>
  )
}

export default ExcelSheetsTabs
