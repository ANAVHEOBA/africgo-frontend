"use client"

import { useState, useCallback, useEffect, memo } from 'react'
import { getStoreProducts } from '@/lib/stores/api'
import StoreProductCard from '@/components/stores/products/StoreProductCard'
import { Product } from '@/lib/stores/types'
import { ProductStatus } from '@/lib/products/types'

interface StoreProductsProps {
  storeSlug: string | undefined
}

const StoreProducts = memo(function StoreProducts({ storeSlug }: StoreProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  const [hasMore, setHasMore] = useState(false)

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    if (!storeSlug) {
      console.log('No store slug provided')
      return
    }

    try {
      console.log('Fetching products for store:', storeSlug)
      setLoading(true)
      
      const response = await getStoreProducts(storeSlug, filters)
      console.log('API Response:', response)
      
      if (response?.products?.length > 0) {
        setProducts(prev => isLoadMore ? [...prev, ...response.products] : response.products)
        setHasMore(response.pagination?.hasMore || false)
      } else {
        if (!isLoadMore) {
          setProducts([])
        }
        setHasMore(false)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [storeSlug, filters])

  useEffect(() => {
    if (storeSlug) {
      console.log('Fetching products for store slug:', storeSlug)
      fetchProducts(false)
    }
  }, [storeSlug, fetchProducts])

  if (!storeSlug) {
    return <div>No store selected</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-black/5 rounded-lg shadow-md h-[300px] animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <StoreProductCard 
            key={product._id} 
            product={{
              ...product,
              status: ProductStatus.ACTIVE,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt)
            }}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => fetchProducts(true)}
            disabled={loading}
            className="px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
})

export default StoreProducts 