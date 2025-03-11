"use client"

import { useEffect, useState, useCallback, memo } from 'react'
import { StoreFilters as StoreFiltersType } from '@/lib/stores/types'
import { useDebounce } from '@/lib/hooks'

interface StoreFiltersProps {
  filters: StoreFiltersType
  onFilterChange: (filters: Partial<StoreFiltersType>) => void
}

const StoreFilters = memo(function StoreFilters({ filters, onFilterChange }: StoreFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch || undefined })
    }
  }, [debouncedSearch, filters.search, onFilterChange])

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFilterChange({ category: value || undefined })
  }, [onFilterChange])

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFilterChange({ city: value || undefined })
  }, [onFilterChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="bg-black/5 p-4 rounded-lg shadow-md border border-gold-primary/20 space-y-4 hover:border-gold-primary transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search stores..."
              className="w-full pl-10 pr-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
                text-gray-800 placeholder-gray-500 hover:border-gold-primary transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gold-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="sm:w-48">
          <select
            value={filters.category || ''}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
              text-gray-800 hover:border-gold-primary transition-all"
          >
            <option value="">All Categories</option>
            <option value="FASHION">Fashion</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="FOOD">Food</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="sm:w-48">
          <select
            value={filters.city || ''}
            onChange={handleCityChange}
            className="w-full px-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
              text-gray-800 hover:border-gold-primary transition-all"
          >
            <option value="">All Cities</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Port Harcourt">Port Harcourt</option>
            <option value="Kano">Kano</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters 
        filters={filters} 
        onFilterChange={onFilterChange} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
    </div>
  )
})

const ActiveFilters = memo(function ActiveFilters({ 
  filters, 
  onFilterChange, 
  searchTerm, 
  setSearchTerm 
}: { 
  filters: StoreFiltersType
  onFilterChange: (filters: Partial<StoreFiltersType>) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.category && (
        <FilterTag
          label={`Category: ${filters.category}`}
          onRemove={() => onFilterChange({ category: undefined })}
        />
      )}
      {filters.city && (
        <FilterTag
          label={`City: ${filters.city}`}
          onRemove={() => onFilterChange({ city: undefined })}
        />
      )}
      {filters.search && (
        <FilterTag
          label={`Search: ${filters.search}`}
          onRemove={() => {
            setSearchTerm('')
            onFilterChange({ search: undefined })
          }}
        />
      )}
    </div>
  )
})

const FilterTag = memo(function FilterTag({ 
  label, 
  onRemove 
}: { 
  label: string
  onRemove: () => void 
}) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm 
      bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
      {label}
      <button 
        onClick={onRemove} 
        className="hover:text-gold-secondary transition-colors"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
})

export default StoreFilters 