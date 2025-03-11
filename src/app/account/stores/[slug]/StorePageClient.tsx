"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getStoreBySlug } from "@/lib/stores/api"
import ConsumerStoreProducts from "@/components/account/stores/products/ProductList"
import { Store } from "@/lib/stores/types"

export default function StorePageClient() {
  const params = useParams()
  const slug = params?.slug as string
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchStore() {
      console.log('Fetching store with slug:', slug)
      
      if (!slug) {
        console.error('No slug provided')
        setError('Store not found')
        setLoading(false)
        return
      }

      try {
        const storeData = await getStoreBySlug(slug)
        console.log('Store data received:', storeData)
        setStore(storeData)
      } catch (err) {
        console.error('Error fetching store:', err)
        setError('Failed to load store')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStore()
  }, [slug])

  if (loading) {
    console.log('Loading state...')
    return <div className="text-center p-4">Loading store details...</div>
  }
  
  if (error) {
    console.log('Error state:', error)
    return <div className="text-red-500 text-center p-4">{error}</div>
  }
  
  if (!store) {
    console.log('No store found')
    return <div className="text-center p-4">Store not found</div>
  }

  console.log('Rendering store products with:', {
    slug: slug,
    storeId: store._id
  })

  return <ConsumerStoreProducts storeSlug={slug} storeId={store._id} />;
} 