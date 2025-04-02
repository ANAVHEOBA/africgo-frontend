"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/lib/products/types'

interface ProductImagesProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

export default function ProductImages({ images, onChange }: ProductImagesProps) {
  console.log('ProductImages - Received images:', images); // Log received images

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    console.log('ProductImages - Files selected:', files.length); // Log selected files

    setUploading(true)
    setError(null)

    try {
      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
      )

      console.log('ProductImages - Valid files:', validFiles.length); // Log valid files

      if (validFiles.length !== files.length) {
        throw new Error('Some files were invalid. Please only upload images under 5MB.')
      }

      // Create temporary URLs for preview
      const newImages: ProductImage[] = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        alt: file.name
      }))

      console.log('ProductImages - Created image objects:', newImages); // Log created image objects

      onChange([...images, ...newImages])
    } catch (err) {
      console.error('ProductImages - Upload error:', err); // Log upload errors
      setError(err instanceof Error ? err.message : 'Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const reorderImages = (dragIndex: number, dropIndex: number) => {
    const newImages = [...images]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    onChange(newImages)
  }

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-sm border border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Product Images</h3>

      {error && (
        <div className="mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((image, index) => (
          <div
            key={image.url}
            className="relative group aspect-square border border-white/10 rounded-lg overflow-hidden bg-dark-primary"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
              reorderImages(dragIndex, index);
            }}
          >
            <Image
              src={image.url}
              alt={image.alt || `Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 
                group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                Main Image
              </div>
            )}
          </div>
        ))}

        <label className="border-2 border-dashed border-white/10 rounded-lg aspect-square flex items-center 
          justify-center cursor-pointer hover:border-gold-primary transition-colors bg-dark-primary">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-2 block text-sm text-text-secondary">
              {uploading ? 'Uploading...' : 'Add Image'}
            </span>
          </div>
        </label>
      </div>

      <p className="text-sm text-text-secondary">
        Drag images to reorder. First image will be the main product image.
      </p>
    </div>
  )
} 