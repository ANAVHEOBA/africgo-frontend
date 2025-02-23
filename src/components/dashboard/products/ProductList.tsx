"use client"

import { useEffect, useState } from 'react'
import { Product, ProductFilters as ProductFilterType, PaginatedProducts } from '@/lib/products/types'
import { getStoreProducts } from '@/lib/products/api'
import ProductCard from './ProductCard'
import ProductFilterComponent from './ProductFilters'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilterType>({
    page: 1,
    limit: 12,
  })
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const fetchWithRetry = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchWithRetry, 1000 * retryCount); // Exponential backoff
        }
      }
    };

    fetchWithRetry();
  }, [filters]);

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const data = await getStoreProducts(filters)
      setProducts(data.products)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<ProductFilterType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
        <p className="mt-2 text-gray-500">
          Get started by creating a new product.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button 
          onClick={() => window.location.href = '/dashboard/products/new'}
          className="px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary"
        >
          Add New Product
        </button>
      </div>

      <ProductFilterComponent 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onDelete={() => fetchProducts()}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded ${
              filters.page === i + 1
                ? 'bg-gold-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
} 