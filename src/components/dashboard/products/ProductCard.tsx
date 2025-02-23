"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product, ProductStatus } from '@/lib/products/types'
import { deleteProduct, updateProduct } from '@/lib/products/api'

interface ProductCardProps {
  product: Product
  onDelete: () => void
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEdit = () => {
    router.push(`/dashboard/products/${product._id}`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteProduct(product._id)
      onDelete()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const togglePublished = async () => {
    try {
      setIsUpdating(true)
      await updateProduct(product._id, {
        isPublished: !product.isPublished
      })
      onDelete() // Refresh the list
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case ProductStatus.OUT_OF_STOCK:
        return 'bg-red-100 text-red-800'
      case ProductStatus.DISCONTINUED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-gold-primary transition-colors">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
          {product.status}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg truncate" title={product.name}>
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2" title={product.description}>
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gold-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t">
          <button
            onClick={togglePublished}
            disabled={isUpdating}
            className={`px-3 py-1 rounded text-sm ${
              product.isPublished
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isUpdating ? 'Updating...' : (product.isPublished ? 'Published' : 'Draft')}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <span className="sr-only">Edit</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <span className="sr-only">Delete</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 