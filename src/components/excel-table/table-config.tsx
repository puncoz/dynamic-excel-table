import TableColumnSelector from "@/components/excel-table/table-column-selector"
import TableFilterConfig from "@/components/excel-table/table-filter-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FunctionComponent } from "react"
import { FaTools } from "react-icons/fa"

const TableConfig: FunctionComponent = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FaTools/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Table config</DropdownMenuLabel>
        <DropdownMenuSeparator/>

        <DropdownMenuGroup className="flex flex-col">
          <DropdownMenuItem asChild>
            <TableColumnSelector/>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <TableFilterConfig/>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableConfig


