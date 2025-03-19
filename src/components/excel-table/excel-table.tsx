import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSheetStoreComputed from "@/hooks/sheet-store"
import { FunctionComponent } from "react"

const ExcelTable: FunctionComponent = () => {
  const { getFilteredHeaders, getFilteredExcelData } = useSheetStoreComputed()

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
