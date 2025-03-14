import ExcelTableWrapper from "@/components/excel-table/excel-table-wrapper"
import ExcelUpload from "@/components/excel-upload"

const HomePage = () => {
  return (
    <div>
      <ExcelUpload/>
      <ExcelTableWrapper/>
    </div>
  )
}

export default HomePage
