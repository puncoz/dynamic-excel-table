"use client"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import { type ChangeEvent, type FunctionComponent, useCallback } from "react"
import { FaFileExcel } from "react-icons/fa"
import * as XLSX from "xlsx"

const ExcelUpload: FunctionComponent = () => {
  const showExcelUpload = useAppStore(state => state.showExcelUpload)
  const setExcelData = useAppStore(state => state.setExcelData)

  const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = function (e) {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      const sheets = workbook.SheetNames

      const jsonData = []
      for (const sheetName of sheets) {
        const worksheet = workbook.Sheets[sheetName]
        const sheetData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: true })

        const trimmedSheetData = sheetData.filter(row => !row.every(cell => !cell || !cell.toString().trim()))

        const headers = trimmedSheetData[0]
        trimmedSheetData.shift()

        const formattedSheetData = trimmedSheetData.map(row => {
          const rowKeyVal: Record<string, string> = {}
          for (let i = 0; i < headers.length; i++) {
            if (headers[i]) {
              rowKeyVal[headers[i]] = row[i]
            }
          }
          return rowKeyVal
        })

        if (formattedSheetData.length > 0) {
          jsonData.push({ sheetName, data: formattedSheetData })
        }
      }

      if (jsonData.length === 0) {
        alert("Empty file. Please upload a valid Excel file.")
        return
      }

      setExcelData(jsonData)
    }
  }, [setExcelData])

  if (!showExcelUpload) {
    return null
  }

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <label className={cn(
        "bg-[#c8dadf] outline-2 outline-dashed outline-[#92b0b3] outline-offset-[-10px] text-lg p-32",
        "cursor-pointer transition-file-upload-box",
        "hover:outline-offset-[-20px] hover:bg-[#c8dadf77]",
        "flex flex-col justify-center items-center gap-4 text-center",
      )}>
        <FaFileExcel className="size-24 text-[#6aa9ba]"/>
        <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload}/>
        <div>
          <p>
            Please upload an Excel (<span className="text-red-500">.xlsx or .xls</span>) file to begin.
          </p>
          <p>
            <strong>Click here</strong> to select an Excel file.
          </p>
        </div>
      </label>

      <p className="text-xs mt-4">
        Sample excel file: <a href="/sample.xlsx"
                              download="sample.xlsx"
                              target="_blank"
                              className="underline text-blue-500">Download</a>
      </p>
    </section>
  )
}

export default ExcelUpload
