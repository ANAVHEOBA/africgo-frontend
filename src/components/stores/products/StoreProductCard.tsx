"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/stores/types'

interface StoreProductCardProps {
  product: Product
}

export default function StoreProductCard({ product }: StoreProductCardProps) {
  const isMounted = useRef(true)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Use intersection observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`store-product-${product._id}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [product._id])

  // Set image URL
  useEffect(() => {
    const url = process.env.NODE_ENV === 'development'
      ? `https://picsum.photos/seed/${product._id}/400/300`
      : product.images[0] || ''
    
    setImageUrl(url)

    return () => {
      isMounted.current = false
    }
  }, [product._id, product.images])

  const handleImageLoad = useCallback(() => {
    if (isMounted.current) {
      setIsImageLoading(false)
    }
  }, [])

  const handleImageError = useCallback(() => {
    if (isMounted.current) {
      setImageError(true)
      setIsImageLoading(false)
    }
  }, [])

  return (
    <div 
      id={`store-product-${product._id}`}
      className="bg-black/5 rounded-lg shadow-md overflow-hidden border border-gold-primary/20 
        hover:border-gold-primary transition-all hover:shadow-lg group"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-black/10">
        {isVisible && imageUrl && !imageError ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-primary"></div>
              </div>
            )}
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              quality={75}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg truncate text-gray-900" title={product.name}>
          {product.name}
        </h3>
        
        <p className="text-gray-700 text-sm line-clamp-2" title={product.description}>
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gold-primary">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-sm text-gray-700">
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full py-2 bg-gold-primary text-white rounded-lg 
            hover:bg-gold-secondary transition-colors mt-3
            disabled:opacity-50 disabled:cursor-not-allowed
            group-hover:bg-gold-secondary"
          disabled={product.stock === 0}
          onClick={() => {
            // TODO: Implement cart functionality
            console.log('Add to cart:', product._id)
          }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
} 