"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, CreateProductData, ProductStatus } from '@/lib/products/types'
import { createProduct, updateProduct } from '@/lib/products/api'
import ProductImages from './ProductImages'
import ProductVariants from './ProductVariants'

interface ProductFormProps {
  initialData?: Product
  isEditing?: boolean
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateProductData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'FASHION',
    images: initialData?.images || [],
    stock: initialData?.stock || 0,
    specifications: {
      material: initialData?.specifications?.material || 'Cotton',
      size: initialData?.specifications?.size || 'S,M,L',
      color: initialData?.specifications?.color || 'Black'
    },
    variants: initialData?.variants || [],
    isPublished: initialData?.isPublished || false,
    guestOrderEnabled: initialData?.guestOrderEnabled ?? true,
    minOrderQuantity: initialData?.minOrderQuantity || 1,
    maxOrderQuantity: initialData?.maxOrderQuantity || 999,
    shippingInfo: initialData?.shippingInfo || {
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      requiresSpecialHandling: false
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Product name is required')
      }

      if (formData.description.length < 10) {
        throw new Error('Description must be at least 10 characters long')
      }

      // Validate specifications
      if (!formData.specifications?.material?.trim() || 
          !formData.specifications?.size?.trim() || 
          !formData.specifications?.color?.trim()) {
        throw new Error('Material, Size, and Color specifications are required')
      }

      // Validate variants
      const variants = formData.variants || []
      if (variants.length > 0) {
        const invalidVariants = variants.some(variant => 
          !variant.options || variant.options.length === 0
        )
        if (invalidVariants) {
          throw new Error('Each variant must have at least one option')
        }
      }

      const productData: CreateProductData = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        variants: variants.map(variant => ({
          name: variant.name,
          options: variant.options,
          prices: variant.prices?.map(price => Number(price) || 0)
        }))
      }

      if (isEditing && initialData) {
        await updateProduct(initialData._id, productData)
      } else {
        await createProduct(productData)
      }
      router.push('/dashboard/products')
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-dark-secondary p-6 rounded-lg shadow-sm border border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <ProductImages
        images={formData.images}
        onChange={(images) => setFormData({ ...formData, images })}
      />

      {/* Variants */}
      <ProductVariants
        variants={formData.variants || []}
        onChange={(variants) => setFormData({ ...formData, variants })}
      />

      {/* Specifications */}
      <div className="bg-dark-secondary p-6 rounded-lg shadow-sm border border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Specifications</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Material
            </label>
            <input
              type="text"
              value={formData.specifications?.material}
              onChange={(e) => setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  material: e.target.value
                }
              })}
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Size (comma-separated)
            </label>
            <input
              type="text"
              value={formData.specifications?.size}
              onChange={(e) => setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  size: e.target.value
                }
              })}
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              placeholder="S,M,L"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Color (comma-separated)
            </label>
            <input
              type="text"
              value={formData.specifications?.color}
              onChange={(e) => setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  color: e.target.value
                }
              })}
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              placeholder="Black,White,Blue"
              required
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-dark-secondary p-6 rounded-lg shadow-sm border border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-gold-primary focus:ring-gold-primary border-white/10 rounded bg-dark-primary"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-text-secondary">
              Publish product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="guestOrderEnabled"
              checked={formData.guestOrderEnabled}
              onChange={(e) => setFormData({ ...formData, guestOrderEnabled: e.target.checked })}
              className="h-4 w-4 text-gold-primary focus:ring-gold-primary border-white/10 rounded bg-dark-primary"
            />
            <label htmlFor="guestOrderEnabled" className="ml-2 block text-sm text-text-secondary">
              Allow guest orders
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-white/10 rounded-lg text-text-secondary 
            hover:bg-dark-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-gold-primary to-gold-secondary 
            text-dark-primary rounded-lg hover:shadow-lg hover:shadow-gold-primary/20 
            disabled:opacity-50 transition-all duration-300"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
} 