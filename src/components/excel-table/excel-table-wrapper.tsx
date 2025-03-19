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
      <div className="grid grid-cols-[auto_max-content] w-full mt-4 gap-32">
        <TableFilters/>
        <TableConfig/>
      </div>

      {/*table*/}
      <div className="mt-4">
        <ExcelTable/>
      </div>
    </div>
  )
}

export default ExcelTableWrapper
