import type { StateCreator } from "zustand/vanilla"

export interface ExcelData {
  sheetName: string
  data: Record<string, string>[]
}

export interface FilterConfig {
  searchEnabled: boolean
  searchField: string
  filters: string[]
}

export interface AppliedFilterConfig {
  searchText?: string
  filterValues: Record<string, string>
}

export interface AppState {
  excelData?: ExcelData[]
  showExcelUpload?: boolean
  initialLoading?: boolean

  activeSheet?: string

  selectedColumns: Record<string, string[]>
  filters: Record<string, FilterConfig>
  appliedFilters: Record<string, AppliedFilterConfig>
}

interface AppAction {
  setInitialLoading: (status: boolean) => void
  setExcelData: (excelData: ExcelData[]) => void

  setActiveSheet: (sheetName?: string) => void
  setSelectedColumns: (sheetName: string, columns: string[]) => void

  setFilters: (sheetName: string, filters: FilterConfig) => void
  setAppliedFilters: (sheetName: string, appliedFilters: AppliedFilterConfig) => void

  clearData: () => void
}

export type AppSlice = AppState & AppAction

const initialState: AppState = {
  excelData: [],
  showExcelUpload: true,
  initialLoading: true,

  activeSheet: typeof window === "undefined" ? undefined : localStorage.getItem("activeSheet") || undefined,
  selectedColumns: typeof window === "undefined" ? {} : JSON.parse(localStorage.getItem("selectedColumns") || "{}"),

  filters: typeof window === "undefined" ? {} : JSON.parse(localStorage.getItem("filters") || "{}"),
  appliedFilters: {},
}

export const createAppSlice: StateCreator<AppSlice> = (setState, getState) => ({
  ...initialState,

  setInitialLoading: (status: boolean) => {
    setState({ initialLoading: status })
  },

  setExcelData: (excelData: ExcelData[]) => {
    localStorage.setItem("excelData", JSON.stringify(excelData))
    if (excelData.length > 0) {
      setState({ showExcelUpload: false })
    }
    setState({ excelData })
  },

  setActiveSheet: (sheetName?: string) => {
    if (!sheetName) {
      localStorage.removeItem("activeSheet")
      setState({ activeSheet: undefined })
      return
    }

    localStorage.setItem("activeSheet", sheetName)
    setState({ activeSheet: sheetName })
  },

  setSelectedColumns: (sheetName: string, columns: string[]) => {
    const currentSelectedColumns = getState().selectedColumns
    const updatedSelectedColumns = { ...currentSelectedColumns, [sheetName]: columns }

    localStorage.setItem("selectedColumns", JSON.stringify(updatedSelectedColumns))
    setState({ selectedColumns: updatedSelectedColumns })
  },

  setFilters: (sheetName: string, filters: FilterConfig) => {
    const currentFilters = getState().filters
    const updatedFilters = { ...currentFilters, [sheetName]: filters }

    localStorage.setItem("filters", JSON.stringify(updatedFilters))
    setState({ filters: updatedFilters })
  },

  setAppliedFilters: (sheetName: string, filters: AppliedFilterConfig) => {
    const currentFilters = getState().appliedFilters
    const updatedFilters = { ...currentFilters, [sheetName]: filters }

    setState({ appliedFilters: updatedFilters })
  },

  clearData: () => {
    localStorage.removeItem("excelData")
    localStorage.removeItem("activeSheet")
    localStorage.removeItem("selectedColumns")
    setState({ excelData: [], activeSheet: undefined })
    setState({ showExcelUpload: true })
  },
})
