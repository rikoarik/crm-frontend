"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
    RowSelectionState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DataTableToolbar } from "./data-table-toolbar"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRefresh?: () => void
    selectedProvince?: string
    onProvinceChange?: (provinceId: string) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRefresh,
    selectedProvince,
    onProvinceChange,
}: DataTableProps<TData, TValue>) {
    React.useEffect(() => {
        const handleUpdate = () => {
            onRefresh?.()
        }
        window.addEventListener('leadUpdated', handleUpdate)
        return () => window.removeEventListener('leadUpdated', handleUpdate)
    }, [onRefresh])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    })

    return (
        <div className="space-y-4">
            <DataTableToolbar 
                table={table} 
                selectedProvince={selectedProvince}
                onProvinceChange={onProvinceChange}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={table.getIsAllPageRowsSelected()}
                                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={row.getIsSelected()}
                                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                                            aria-label="Select row"
                                        />
                                    </TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {Object.keys(rowSelection).length > 0 && (
                        <span>
                            {Object.keys(rowSelection).length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </span>
                    )}
                    {Object.keys(rowSelection).length === 0 && (
                        <span>
                            {table.getFilteredRowModel().rows.length} total row(s)
                        </span>
                    )}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

