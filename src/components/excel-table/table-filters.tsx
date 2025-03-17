import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSheetStoreComputed from "@/hooks/sheet-store"
import { useAppStore } from "@/store/store"
import { type ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from "react"


const TableFilters: FunctionComponent = () => {
  const activeSheet = useAppStore(state => state.activeSheet)
  const setAppliedFilters = useAppStore(state => state.setAppliedFilters)
  const { getFilters, getOptionsForColumn } = useSheetStoreComputed()

  const filters = useMemo(() => getFilters(), [getFilters])

  const [searchText, setSearchText] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const handleOnSearchTextChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }, [])

  const handleOnFilterFieldChange = useCallback((name: string, value: string) => {
    setFilterValues(state => {
      const updated = { ...state }
      if (value === "__ALL__") {
        delete updated[name]
      } else {
        updated[name] = value
      }

      return { ...updated }
    })
  }, [])

  const resetForm = useCallback(() => {
    setSearchText("")
    setFilterValues({})
  }, [])

  const handleOnFilter = useCallback(() => {
    setAppliedFilters(activeSheet || "", { searchText, filterValues })
  }, [activeSheet, filterValues, searchText, setAppliedFilters])

  if (!filters || (!filters.searchEnabled && filters.filters.length === 0)) {
    return (<div/>)
  }

  return (
    <div onSubmit={handleOnFilter} className="flex flex-row gap-2">
      {filters.searchEnabled && (
        <Input type="search" placeholder="Search..." value={searchText} onChange={handleOnSearchTextChange}/>
      )}

      {filters.filters.map((filter, index) => (
        <Select key={`filter-${index}-${filter}`}
                onValueChange={(val) => handleOnFilterFieldChange(filter, val)}
                defaultValue={filterValues[filter]}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={`Select ${filter}`}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Select {filter}</SelectItem>
            {getOptionsForColumn(filter).map((value) => (
              <SelectItem key={`${filter}-${value}`} value={value}>{value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <Button type="submit" onClick={handleOnFilter}>
        Filter
      </Button>
      <Button type="button" variant="outline" onClick={resetForm}>
        Reset
      </Button>
    </div>
  )
}

export default TableFilters
