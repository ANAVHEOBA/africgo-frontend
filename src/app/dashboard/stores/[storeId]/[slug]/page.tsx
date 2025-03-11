"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Store } from '@/lib/stores/types'
import { Product } from '@/lib/products/types'
import { getStoreBySlug } from '@/lib/stores/api'
import { getProductsByStore } from '@/lib/products/api'

export default function StorePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStoreAndProducts() {
      if (!slug) {
        setError('Store not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [storeData, productsData] = await Promise.all([
          getStoreBySlug(slug),
          getProductsByStore(slug)
        ])
        
        setStore(storeData)
        setProducts(productsData.products || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching store data:', err)
        setError('Failed to load store details. Please try again.')
        setStore(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreAndProducts()
  }, [slug])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-black/40 rounded-lg h-[100px] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="bg-black/40 rounded-lg h-[200px] animate-pulse" 
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
        {error || 'Store not found'}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Store Header */}
      <div className="bg-black/20 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{store.storeName}</h1>
            {store.settings?.isVerified && (
              <span className="bg-gold-primary/10 text-gold-primary px-3 py-1 rounded-full text-sm">
                Verified
              </span>
            )}
          </div>
          <p className="text-light-600">{store.description}</p>
          <div className="flex items-center space-x-4 text-sm text-light-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {store.address?.city}, {store.address?.state}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Products</h2>
        {products.length === 0 ? (
          <p className="text-light-600">No products available in this store yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-black/20 rounded-lg overflow-hidden">
                {product.images?.[0] && (
                  <div className="aspect-square relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-light-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-primary font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => {/* Add order handling */}}
                      className="px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}