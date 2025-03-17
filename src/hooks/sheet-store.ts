import { useAppStore } from "@/store/store"
import { useCallback } from "react"

const useSheetStoreComputed = () => {
  const excelData = useAppStore(state => state.excelData)
  const setActiveSheet = useAppStore(state => state.setActiveSheet)
  const activeSheet = useAppStore(state => state.activeSheet)
  const selectedColumns = useAppStore(state => state.selectedColumns)
  const setSelectedColumns = useAppStore(state => state.setSelectedColumns)
  const filters = useAppStore(state => state.filters)

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

  const getFilters = useCallback(() => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return null
    }

    return filters[activeSheet] || null
  }, [filters, getActiveSheet])

  const getFilteredHeaders = useCallback(() => {
    const headers = getHeaders()
    const selectedColumns = getSelectedColumns()

    return headers.filter(header => selectedColumns.includes(header))
  }, [getHeaders, getSelectedColumns])

  const getFilteredExcelData = useCallback(() => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return []
    }

    const currentSheetData = excelData?.find(excelSheet => excelSheet.sheetName === activeSheet)?.data || []
    const headers = getFilteredHeaders()

    return currentSheetData.map(row => {
      return headers.reduce((acc, column) => {
        acc[column] = row[column]
        return acc
      }, {} as Record<string, string>)
    })
  }, [getActiveSheet, excelData, getFilteredHeaders])

  return {
    getActiveSheet,
    getHeaders,
    getSelectedColumns,
    getFilters,
    getFilteredHeaders,
    getFilteredExcelData,
  }
}

export default useSheetStoreComputed
