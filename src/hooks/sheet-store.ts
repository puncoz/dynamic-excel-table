import { useAppStore } from "@/store/store"
import { useCallback } from "react"

const useSheetStoreComputed = () => {
  const excelData = useAppStore(state => state.excelData)
  const setActiveSheet = useAppStore(state => state.setActiveSheet)
  const activeSheet = useAppStore(state => state.activeSheet)
  const selectedColumns = useAppStore(state => state.selectedColumns)
  const setSelectedColumns = useAppStore(state => state.setSelectedColumns)
  const filters = useAppStore(state => state.filters)
  const appliedFilters = useAppStore(state => state.appliedFilters)

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

  const getAppliedFilters = useCallback(() => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return null
    }

    return appliedFilters[activeSheet] || null
  }, [appliedFilters, getActiveSheet])

  const getFilteredExcelData = useCallback(() => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return []
    }

    const currentSheetData = excelData?.find(excelSheet => excelSheet.sheetName === activeSheet)?.data || []
    const headers = getFilteredHeaders()
    const filters = getFilters()
    const appliedFilters = getAppliedFilters()

    let filteredData = [...currentSheetData]
    if (appliedFilters) {
      filteredData = filteredData.filter(row => {
        if (appliedFilters.searchText && filters?.searchEnabled && filters?.searchField && !row[filters.searchField]?.toLowerCase()?.includes(appliedFilters.searchText.toLowerCase())) {
          return false
        }

        return Object.entries(appliedFilters.filterValues).every(([key, value]) => {
          return !(value && row[key] !== value)
        })
      })
    }

    return filteredData.map(row => {
      return headers.reduce((acc, column) => {
        acc[column] = row[column]
        return acc
      }, {} as Record<string, string>)
    })
  }, [getActiveSheet, excelData, getFilteredHeaders, getFilters, getAppliedFilters])

  const getOptionsForColumn = useCallback((column: string) => {
    const activeSheet = getActiveSheet()
    if (!activeSheet) {
      return []
    }

    const currentSheetData = excelData?.find(excelSheet => excelSheet.sheetName === activeSheet)?.data || []
    const uniqueValues = new Set(currentSheetData.map(row => row[column]))
    return Array.from(uniqueValues)
  }, [excelData, getActiveSheet])

  return {
    getActiveSheet,
    getHeaders,
    getSelectedColumns,
    getFilters,
    getAppliedFilters,
    getFilteredHeaders,
    getFilteredExcelData,
    getOptionsForColumn,
  }
}

export default useSheetStoreComputed
