'use client'

import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { 
  barangayOptions, 
  sexOptions, 
  occupationOptions,
  civilStatusOptions, 
  applicationTypeOptions,
  educationalAttainmentOptions, 
  relationshipOptions
} from '@/lib/config2'


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn('applicationtype') && (
          <DataTableFacetedFilter
            column={table.getColumn('applicationtype')}
            title="Application Type"
            options={applicationTypeOptions}
          />
        )}
         {table.getColumn('sex') && (
          <DataTableFacetedFilter
            column={table.getColumn('sex')}
            title="Sex"
            options={sexOptions}
          />
        )}
        
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Civil Status"
            options={civilStatusOptions}
          />
        )}
      
        {table.getColumn('occupation') && (
          <DataTableFacetedFilter
            column={table.getColumn('occupation')}
            title="Occupation"
            options={occupationOptions}
          />
        )} 
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}