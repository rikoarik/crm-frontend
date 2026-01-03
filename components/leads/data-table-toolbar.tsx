"use client"

import { Table } from "@tanstack/react-table"
import { X, SlidersHorizontal, Settings2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeadStatus } from "@/lib/types"
import { useAuth } from "@/lib/auth/auth-context"
import { provincesApi } from "@/lib/api/provinces"
import { Province } from "@/lib/types"
import { useEffect, useState } from "react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    selectedProvince?: string
    onProvinceChange?: (provinceId: string) => void
}

export function DataTableToolbar<TData>({
    table,
    selectedProvince,
    onProvinceChange,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const { user } = useAuth()
    const [provinces, setProvinces] = useState<Province[]>([])

    useEffect(() => {
        if (user?.role === 'superadmin') {
            provincesApi.getAllProvinces().then(setProvinces).catch(() => {});
        }
    }, [user]);

    const statuses: LeadStatus[] = ["New", "Contacted", "Interested", "Deal", "Junk"]

    const exportToCSV = () => {
        const rows = table.getFilteredRowModel().rows
        const headers = table.getAllColumns()
            .filter(col => col.getIsVisible() && col.id !== 'actions')
            .map(col => col.id)

        const csvContent = [
            headers.join(','),
            ...rows.map(row => 
                headers.map(header => {
                    const value = row.getValue(header)
                    return `"${String(value).replace(/"/g, '""')}"`
                }).join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter leads..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {/* Province Filter - Superadmin only */}
                {user?.role === 'superadmin' && provinces.length > 0 && onProvinceChange && (
                    <Select value={selectedProvince || 'all'} onValueChange={(value) => onProvinceChange(value === 'all' ? '' : value)}>
                        <SelectTrigger className="h-8 w-[180px]">
                            <SelectValue placeholder="All Provinces" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Provinces</SelectItem>
                            {provinces.map(province => (
                                <SelectItem key={province.id} value={province.id}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Status Filter */}
                {table.getColumn("status") && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 border-dashed">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes(status)}
                                    onCheckedChange={(checked) => {
                                        const column = table.getColumn("status")
                                        const filterValue = (column?.getFilterValue() as string[]) || []

                                        if (checked) {
                                            column?.setFilterValue([...filterValue, status])
                                        } else {
                                            column?.setFilterValue(filterValue.filter((v) => v !== status))
                                        }
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    className="h-8"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto hidden h-8 lg:flex"
                        >
                            <Settings2 className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

