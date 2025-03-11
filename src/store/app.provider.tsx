"use client"

import type { AppState } from "@/store/app.slice"
import React, { type FunctionComponent, useEffect } from "react"
import { useAppStore } from "./store"

type Props = Readonly<{
  appState: Partial<AppState>

  children: React.ReactNode
}>

const AppProvider: FunctionComponent<Props> = ({ children, appState }) => {
  const setExcelData = useAppStore(state => state.setExcelData)
  const setInitialLoading = useAppStore(state => state.setInitialLoading)

  useEffect(() => {
    setExcelData(appState.excelData || [])
  }, [appState.excelData, setExcelData])

  useEffect(() => {
    setInitialLoading(appState.initialLoading || false)
  }, [appState.initialLoading, setInitialLoading])

  return children
}

export default AppProvider
