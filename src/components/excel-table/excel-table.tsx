import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSheetStoreComputed from "@/hooks/sheet-store"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import { FunctionComponent, useCallback, useMemo } from "react"

const ExcelTable: FunctionComponent = () => {
  const colorOptions = useAppStore(state => state.colorOptions)
  const { getFilteredHeaders, getFilteredExcelData, getOtherConfig } = useSheetStoreComputed()

  const trafficLight = useMemo(() => {
    const otherConfig = getOtherConfig()
    if (!otherConfig?.trafficLightEnabled) {
      return null
    }

    return {
      column: otherConfig.trafficLightField,
      colors: otherConfig.trafficLightColors,
    }
  }, [getOtherConfig])

  const getTrafficLightClass = useCallback((row: Record<string, string>) => {
    if (!trafficLight) {
      return ""
    }

    const value = row[trafficLight.column]

    const color = trafficLight.colors.find(color => color.value === value)
    if (!color) {
      return ""
    }

    return colorOptions[color.color] || ""
  }, [colorOptions, trafficLight])

  return (
    <Table containerClassName="relative max-h-[calc(100vh-3rem-1rem-1.5rem-1rem-4rem)] overflow-y-auto overflow-x-auto">
      <TableHeader className="sticky top-0 bg-white shadow-md">
        <TableRow>
          {getFilteredHeaders()?.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {getFilteredExcelData().map((row, index) => (
          <TableRow key={index} className={cn(getTrafficLightClass(row))}>
            {Object.entries(row).map(([key, value]) => (
              <TableCell key={`${index}-${key}`}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ExcelTable
