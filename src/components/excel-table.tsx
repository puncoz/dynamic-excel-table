"use client"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import DT from "datatables.net-dt"
import DataTable from "datatables.net-react"
import { FunctionComponent, useCallback } from "react"
import { FaFileExcel } from "react-icons/fa"
import { FaChartArea } from "react-icons/fa6"

const ExcelTable: FunctionComponent = () => {
  const excelData = useAppStore(state => state.excelData)
  const activeSheet = useAppStore(state => state.activeSheet)
  const setActiveSheet = useAppStore(state => state.setActiveSheet)

  DataTable.use(DT)

  const getActiveSheet = useCallback(() => {
    if (activeSheet) {
      return activeSheet
    }

    const firstSheet = excelData?.[0]?.sheetName
    setActiveSheet(firstSheet || undefined)
    return firstSheet
  }, [activeSheet, excelData, setActiveSheet])

  const handleTabSelect = useCallback((sheetName: string) => {
    setActiveSheet(sheetName)
  }, [setActiveSheet])

  const getHeaders = useCallback(() => {
    return excelData?.find(excelSheet => excelSheet.sheetName === getActiveSheet())?.data[0] || []
  }, [excelData, getActiveSheet])

  return (
    <div className="h-screen mx-auto bg-white p-6">

      {/*tabs*/}
      <div className="flex justify-between border-b">
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
        <div className="flex">
          <button
            className="flex gap-2 items-center px-4 py-2 text-gray-700 border-b-2 cursor-pointer hover:border-blue-500">
            <FaChartArea/>
            Visualization
          </button>
          <button className={cn(
            "flex gap-2 items-center px-4 py-2 border-b-2 border-red-300 cursor-pointer text-red-500",
            "hover:border-red-500",
          )}>
            <FaFileExcel/>
            Re-upload Excel
          </button>
        </div>
      </div>

      {/*filter and column selection*/}
      <div className="flex justify-between items-center mt-4">
        <input type="text"
               placeholder="Search..."
               className="border p-2 rounded w-1/3"/>
        <div>
          <label className="mr-2">
            <input type="checkbox"
                   className="column-toggle"
                   data-column="1"/>
            Name
          </label>
          <label className="mr-2">
            <input type="checkbox"
                   className="column-toggle"
                   data-column="2"/>
            Age
          </label>
          <label>
            <input type="checkbox"
                   className="column-toggle"
                   data-column="3"/>
            City
          </label>
        </div>
      </div>

      {/*table*/}
      <div className="h-80">
        {/*sheet 1*/}
        <div className="mt-4 overflow-x-auto overflow-y-auto">
          <DataTable className="w-full border-collapse border"
                     options={{
                       destroy: true,
                       paging: false,
                       searching: false,
                       scrollX: false
                     }}>
            <thead className="bg-blue-500 text-white">
              <tr className="">
                {getHeaders()?.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData?.find(excelSheet => excelSheet.sheetName === getActiveSheet())?.data?.slice(1)?.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export default ExcelTable
