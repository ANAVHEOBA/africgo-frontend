"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Store } from "@/lib/stores/types"
import { getStores } from "@/lib/stores/api"
import StoreCard from "@/components/stores/listing/StoreCard"

export default function AccountStoreList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores()
        // Extract stores array from paginated response
        setStores(data.stores || [])
        setLoading(false)
      } catch (error) {
        setError("Failed to load stores")
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  if (loading) {
    return <div className="text-white">Loading stores...</div>
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Browse Stores</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stores.map((store) => (
          <StoreCard 
            key={store._id} 
            store={store}
            href={`/account/stores/${store.slug}`}
            storeId={store._id}
          />
        ))}
      </motion.div>
    </div>
  )
} 