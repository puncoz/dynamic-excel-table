"use client"
import { useAppStore } from "@/store/store"
import { FunctionComponent } from "react"

const InitialPageLoader: FunctionComponent = () => {
  const isLoading = useAppStore(state => state.initialLoading)

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Lightning Icon */}
        <div className="relative w-20 h-20 animate-pulse">
          <svg
            className="w-full h-full text-yellow-400 drop-shadow-lg animate-spin-slow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h7v8l7-12h-7z"/>
          </svg>
        </div>

        {/* Loading Text */}
        <p className="text-xl text-white font-semibold animate-pulse">
          Powering up...
        </p>
      </div>
    </div>
  )
}

export default InitialPageLoader
