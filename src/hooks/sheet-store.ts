import { useAppStore } from "@/store/store"
import { useCallback } from "react"

const useSheetStoreComputed = () => {
  const excelData = useAppStore(state => state.excelData)
  const setActiveSheet = useAppStore(state => state.setActiveSheet)
  const activeSheet = useAppStore(state => state.activeSheet)
  const selectedColumns = useAppStore(state => state.selectedColumns)
  const setSelectedColumns = useAppStore(state => state.setSelectedColumns)

  const getActiveSheet = useCallback(() => {
    if (activeSheet) {
      return activeSheet
    }

    const firstSheetName = excelData?.[0]?.sheetName
    setActiveSheet(firstSheetName || undefined)

    return firstSheetName
  }, [activeSheet, excelData, setActiveSheet])

  const getHeaders = useCallback(() => {
    const row = excelData?.find(excelSheet => excelSheet.sheetName === getActiveSheet())?.data[0] || []
    if (!row) {
      return []
    }

    return Object.keys(row)
  }, [excelData, getActiveSheet])

  const getSelectedColumns = useCallback(() => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return []
    }

    const selectedColumnsForActiveSheet = selectedColumns[activeSheet]

    if (selectedColumnsForActiveSheet && selectedColumnsForActiveSheet.length > 0) {
      return selectedColumnsForActiveSheet
    }

    const headers = getHeaders()
    setSelectedColumns(activeSheet, headers)

    return headers
  }, [getActiveSheet, getHeaders, selectedColumns, setSelectedColumns])

  return {
    getActiveSheet,
    getHeaders,
    getSelectedColumns,
  }
}

export default useSheetStoreComputed
