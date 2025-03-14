import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/store"
import { FunctionComponent, useCallback } from "react"
import { FaFileExcel } from "react-icons/fa"
import { FaChartArea } from "react-icons/fa6"

const Menu: FunctionComponent = () => {
  const clearData = useAppStore(state => state.clearData)

  const handleReUploadAction = useCallback(() => {
    clearData()
  }, [clearData])

  return (
    <div className="flex">
      <button
        className="flex gap-2 items-center px-4 py-2 text-gray-700 border-b-2 cursor-pointer hover:border-blue-500">
        <FaChartArea/>
        Visualization
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className={cn(
            "flex gap-2 items-center px-4 py-2 border-b-2 border-red-300 cursor-pointer text-red-500",
            "hover:border-red-500",
          )}>
            <FaFileExcel/>
            Re-upload Excel
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to re-upload the Excel file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the current data, configuration and visualization.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReUploadAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Menu
