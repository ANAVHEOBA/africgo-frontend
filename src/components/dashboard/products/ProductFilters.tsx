"use client";

import { useEffect, useState, useCallback, memo } from "react";
import type { ProductFilters } from "@/lib/products/types";
import { ProductStatus } from "@/lib/products/types";
import { useDebounce } from "@/lib/hooks";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

const ProductFilters = memo(function ProductFilters({
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as ProductStatus;
      onFilterChange({ status: value || undefined });
    },
    [onFilterChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFilterChange({ category: value || undefined });
    },
    [onFilterChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  return (
    <div className="bg-black/5 p-4 rounded-lg shadow-md border border-gold-primary/20 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
                text-light-800 placeholder-gray-500"
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
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
              text-light-800"
          >
            <option value="" className="">
              All Status
            </option>
            {Object.values(ProductStatus).map((status) => (
              <option key={status} value={status} className="">
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:w-48">
          <select
            value={filters.category || ""}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 bg-black/5 border-gold-primary/20 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary
              text-light-800"
          >
            <option value="" className="">
              All Categories
            </option>
            <option value="Electronics" className="">
              Electronics
            </option>
            <option value="Clothing" className="">
              Clothing
            </option>
            <option value="Books" className="">
              Books
            </option>
            <option value="Home" className="">
              Home
            </option>
            <option value="Other" className="">
              Other
            </option>
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
  );
});

const ActiveFilters = memo(function ActiveFilters({
  filters,
  onFilterChange,
  searchTerm,
  setSearchTerm,
}: {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
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
            setSearchTerm("");
            onFilterChange({ search: undefined });
          }}
        />
      )}
    </div>
  );
});

const FilterTag = memo(function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm 
      bg-gold-primary/10 text-gold-primary border border-gold-primary/20"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:text-gold-secondary transition-colors"
        type="button"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
});

export default ProductFilters;
