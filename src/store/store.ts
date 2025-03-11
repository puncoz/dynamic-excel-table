import { type AppSlice, createAppSlice } from "@/store/app.slice"
import { create } from "zustand/react"

export type AppStore = AppSlice

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAppSlice(...a),
}))
