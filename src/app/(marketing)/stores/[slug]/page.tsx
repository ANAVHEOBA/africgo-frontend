"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Store } from '@/lib/stores/types'
import { getStoreBySlug } from '@/lib/stores/api'
import StoreHeader from '@/components/stores/details/StoreHeader'
import StoreProducts from '@/components/stores/details/StoreProducts'

export default function StorePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStore() {
      if (!slug) {
        setError('Store not found')
        setLoading(false)
        return
      }

      try {
        console.log('Fetching store with slug:', slug)
        setLoading(true)
        const data = await getStoreBySlug(slug)
        console.log('Store data:', data)
        setStore(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching store:', err)
        setError('Failed to load store details. Please try again.')
        setStore(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <div className="bg-black/40 rounded-lg h-[200px] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="bg-black/40 rounded-lg h-[400px] animate-pulse border border-gold-primary/20" 
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error || 'Store not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Store Header */}
        <StoreHeader store={store} />

        {/* Store Products Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gold-primary">
            Products
          </h2>
          <StoreProducts storeSlug={slug} />
        </div>
      </div>
    </div>
  )
} 