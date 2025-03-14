"use client"
import ExcelSheetsTabs from "@/components/excel-table/excel-sheets-tabs"
import ExcelTable from "@/components/excel-table/excel-table"
import TableConfig from "@/components/excel-table/table-config"
import TableFilters from "@/components/excel-table/table-filters"
import Menu from "@/components/menu"
import { useAppStore } from "@/store/store"
import { FunctionComponent } from "react"

const ExcelTableWrapper: FunctionComponent = () => {
  const showExcelUpload = useAppStore(state => state.showExcelUpload)

  if (showExcelUpload) {
    return null
  }

  return (
    <div className="h-screen mx-auto bg-white p-6">

      {/*tabs*/}
      <div className="flex justify-between border-b">
        <ExcelSheetsTabs/>
        <Menu/>
      </div>

      {/*filter and column selection*/}
      <div className="flex justify-between items-center mt-4">
        <TableFilters/>
        <TableConfig/>
      </div>

      {/*table*/}
      <div className="max-h-[calc(100vh-3rem-1rem-1.5rem-1rem-4rem)] overflow-y-auto overflow-x-auto">
        <ExcelTable/>
      </div>
    </div>
  )
}

export default ExcelTableWrapper
