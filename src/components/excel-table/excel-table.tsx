import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSheetStoreComputed from "@/hooks/sheet-store"
import { useAppStore } from "@/store/store"
import { FunctionComponent } from "react"

const ExcelTable: FunctionComponent = () => {
  const excelData = useAppStore(state => state.excelData)
  const { getActiveSheet, getHeaders } = useSheetStoreComputed()

  return (
    <Table className="relative">
      <TableHeader>
        <TableRow className="sticky top-0">
          {getHeaders()?.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {excelData?.find(excelSheet => excelSheet.sheetName === getActiveSheet())?.data?.map((row, index) => (
          <TableRow key={index}>
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
