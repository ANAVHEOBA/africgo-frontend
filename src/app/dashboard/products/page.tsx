"use client"

import Link from "next/link"
import ProductList from "@/components/dashboard/products/ProductList"

export default function ProductsPage() {
  console.log("=== Products Page Debug ===")
  console.log("Rendering Products Page")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          href="/dashboard/products/new"
          className="px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary"
        >
          Add New Product
        </Link>
      </div>
      <ProductList />
    </div>
  )
} 