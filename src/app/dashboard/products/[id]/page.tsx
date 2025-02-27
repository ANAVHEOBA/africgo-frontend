"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Product } from "@/lib/products/types"
import { getProductById } from "@/lib/products/api"
import ProductForm from "@/components/dashboard/products/ProductForm"

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(params.id as string)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm initialData={product} isEditing />
    </div>
  )
} 