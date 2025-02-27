"use client"

import { Store } from '@/lib/stores/types'
import StoreCard from './StoreCard'
import { memo } from 'react'

interface StoreGridProps {
  stores: Store[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

const StoreGrid = memo(function StoreGrid({ 
  stores, 
  loading = false,
  onLoadMore,
  hasMore = false 
}: StoreGridProps) {
  if (loading && stores.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-black/5 rounded-lg shadow-md h-[300px] animate-pulse border border-gold-primary/20"
          />
        ))}
      </div>
    )
  }

  if (!loading && stores.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
        <p className="mt-2 text-sm text-gray-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store._id} store={store} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  )
})

export default StoreGrid 