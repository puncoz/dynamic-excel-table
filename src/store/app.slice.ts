import type { StateCreator } from "zustand/vanilla"

export interface ExcelData {
  sheetName: string
  data: string[][]
}

export interface AppState {
  excelData?: ExcelData[]
  showExcelUpload?: boolean
  initialLoading?: boolean

  activeSheet?: string
}

interface AppAction {
  setInitialLoading: (status: boolean) => void
  setExcelData: (excelData: ExcelData[]) => void

  setActiveSheet: (sheetName?: string) => void
}

export type AppSlice = AppState & AppAction

const initialState: AppState = {
  excelData: [],
  showExcelUpload: true,
  initialLoading: true,

  activeSheet: typeof window === "undefined" ? undefined : localStorage.getItem("activeSheet") || undefined,
}

export const createAppSlice: StateCreator<AppSlice> = (setState) => ({
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
})
