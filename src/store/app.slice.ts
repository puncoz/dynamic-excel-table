import type { StateCreator } from "zustand/vanilla"

export interface ExcelData {
  sheetName: string
  data: Record<string, string>[]
}

export interface AppState {
  excelData?: ExcelData[]
  showExcelUpload?: boolean
  initialLoading?: boolean

  activeSheet?: string

  selectedColumns: Record<string, string[]>
}

interface AppAction {
  setInitialLoading: (status: boolean) => void
  setExcelData: (excelData: ExcelData[]) => void

  setActiveSheet: (sheetName?: string) => void
  setSelectedColumns: (sheetName: string, columns: string[]) => void

  clearData: () => void
}

export type AppSlice = AppState & AppAction

const initialState: AppState = {
  excelData: [],
  showExcelUpload: true,
  initialLoading: true,

  activeSheet: typeof window === "undefined" ? undefined : localStorage.getItem("activeSheet") || undefined,
  selectedColumns: typeof window === "undefined" ? {} : JSON.parse(localStorage.getItem("selectedColumns") || "{}"),
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

  clearData: () => {
    localStorage.removeItem("excelData")
    localStorage.removeItem("activeSheet")
    localStorage.removeItem("selectedColumns")
    setState({ excelData: [], activeSheet: undefined })
    setState({ showExcelUpload: true })
  },
})
