"use client"

import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { Product, ProductFilters as ProductFilterType } from '@/lib/products/types'
import { getStoreProducts } from '@/lib/products/api'
import ProductCard from './ProductCard'
import ProductFilterComponent from './ProductFilters'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/utils'
import { tokenStorage } from '@/lib/auth/tokenStorage'

const ProductList = memo(function ProductList() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilterType>({
    page: 1,
    limit: 12,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const debouncedFilters = useDebounce(filters, 500)

  const fetchProducts = useCallback(async () => {
    if (!isInitialLoad) setLoading(true)
    try {
      const token = tokenStorage.getToken()
      const userType = tokenStorage.getUserType()
      
      if (!token || userType !== 'merchant') {
        console.log('No valid merchant token found, redirecting to login')
        router.replace('/login')
        return
      }

      console.log('Fetching products with token:', token)
      const data = await getStoreProducts(debouncedFilters)
      console.log('Products data received:', data)
      
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
      setError(null)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Authentication required') {
          tokenStorage.clearToken()
          router.replace('/login')
          return
        }
        if (err.message === 'Store not found') {
          setError('No store found. Please create a store first.')
          router.replace('/dashboard/store/create')
          return
        }
      }
      setError('Failed to load products. Please try again.')
      console.error('Product fetch error:', err)
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }, [debouncedFilters, router, isInitialLoad])

  useEffect(() => {
    let mounted = true
    const token = tokenStorage.getToken()
    const userType = tokenStorage.getUserType()
    
    if (!token || userType !== 'merchant') {
      console.log('No valid merchant token found, redirecting to login')
      router.replace('/login')
      return
    }

    const fetchData = async () => {
      if (mounted) {
        await fetchProducts()
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [fetchProducts, router])

  const handleFilterChange = useCallback((newFilters: Partial<ProductFilterType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }, [])

  if (loading && isInitialLoad) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md h-[400px] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProductFilterComponent 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {loading && !isInitialLoad ? (
        <div className="opacity-50 pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onDelete={fetchProducts}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product}
              onDelete={fetchProducts}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
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
      )}
    </div>
  )
})

export default ProductList 