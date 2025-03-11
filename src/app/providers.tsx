"use client"
import AppProvider from "@/store/app.provider"
import type { ExcelData } from "@/store/app.slice"
import React, { FunctionComponent, useEffect, useState } from "react"

type Props = Readonly<{
  children: React.ReactNode
}>
const Providers: FunctionComponent<Props> = ({ children }) => {
  const [excelData, setExcelData] = useState<ExcelData[] | undefined>(undefined)

  useEffect(() => {
    setExcelData(JSON.parse(localStorage.getItem("excelData") || "[]"))
  }, [])

  if (typeof excelData === "undefined") {
    return children
  }

  return (
    <AppProvider appState={{
      excelData,
      initialLoading: false
    }}>
      {children}
    </AppProvider>
  )
}

export default Providers
