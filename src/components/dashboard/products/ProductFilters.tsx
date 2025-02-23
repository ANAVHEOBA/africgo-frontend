"use client"

import { useEffect, useState } from 'react'
import { ProductFilters, ProductStatus } from '@/lib/products/types'
import { useDebounce } from '@/lib/utils'

interface ProductFiltersProps {
  filters: ProductFilters
  onFilterChange: (filters: Partial<ProductFilters>) => void
}

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    onFilterChange({ search: debouncedSearch })
  }, [debouncedSearch, onFilterChange])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value as ProductStatus })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
          >
            <option value="">All Status</option>
            {Object.values(ProductStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:w-48">
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.status && (
          <FilterTag
            label={`Status: ${filters.status}`}
            onRemove={() => onFilterChange({ status: undefined })}
          />
        )}
        {filters.category && (
          <FilterTag
            label={`Category: ${filters.category}`}
            onRemove={() => onFilterChange({ category: undefined })}
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
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
} 