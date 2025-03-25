"use client";

import { useCallback, useState, useEffect } from "react";
import { Store, StoreFilters as StoreFiltersType } from "@/lib/stores/types";
import { getStores } from "@/lib/stores/api";
import StoreGrid from "@/components/stores/listing/StoreGrid";
import StoreFilters from "@/components/stores/listing/StoreFilters";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<StoreFiltersType>({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    city: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchStores = useCallback(
    async (isLoadMore = false) => {
      try {
        setLoading(true);
        const data = await getStores(filters);

        setStores((prev) =>
          isLoadMore ? [...prev, ...data.stores] : data.stores
        );
        setHasMore(data.pagination.hasMore);
        setError(null);
      } catch (err) {
        setError("Failed to load stores. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<StoreFiltersType>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset page when filters change
      }));
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-7xl"
      style={{ paddingTop: "100px" }}
    >
      <div className="space-y-8 mt-16">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-primary via-gold-secondary to-gold-accent bg-clip-text text-transparent">
            Explore African Stores
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Discover unique products from verified African businesses
          </p>
        </div>

        {/* Filters */}
        <StoreFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stores Grid */}
        <StoreGrid
          stores={stores}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}
