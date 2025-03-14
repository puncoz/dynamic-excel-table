import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const excelDateToJSDate = (excelDate: number | string) => {
  if (typeof excelDate === "number") {
    const date = new Date((excelDate - 25569) * 86400 * 1000) // Excel date to JavaScript date
    // format date as yyyy-mm-dd
    return date.toISOString().split("T")[0]
  }

  return excelDate
}
