"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { leadsApi } from "@/lib/api/leads"

export interface FilterState {
  startDate?: string
  endDate?: string
  category?: string
  status?: string[]
  city?: string
}

interface AdvancedFiltersProps {
  categories: string[]
  cities: string[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export function AdvancedFilters({ 
  categories, 
  cities, 
  onFilterChange,
  initialFilters 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {Object.keys(filters).filter(key => {
                const value = filters[key as keyof FilterState]
                return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
              }).length}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="p-4 border rounded-lg space-y-4 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('category', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Select
                value={filters.city || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('city', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

