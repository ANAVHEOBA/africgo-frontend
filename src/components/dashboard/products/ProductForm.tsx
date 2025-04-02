"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Product,
  CreateProductData,
  ProductStatus,
  ProductImage,
} from "@/lib/products/types";
import { createProduct, updateProduct } from "@/lib/products/api";
import ProductImages from "./ProductImages";
import ProductVariants from "./ProductVariants";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

// Update the input field styles to ensure text is visible
const inputBaseClasses = `w-full px-4 py-3 bg-dark-primary/5 border-2 border-white/30 rounded-lg
  text-black font-medium text-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 
  focus:ring-gold-primary focus:border-transparent transition-all duration-300
  hover:border-gold-primary/70 shadow-sm shadow-white/10`;

// Update the checkbox container styles
const checkboxContainerClasses = `flex items-center p-4 bg-dark-primary/5 rounded-lg 
  border-2 border-white/30 hover:border-gold-primary/50 
  hover:bg-dark-primary/10 transition-all duration-200`;

// Update the checkbox label styles
const checkboxLabelClasses = `ml-3 text-lg font-medium text-black cursor-pointer
  hover:text-gold-primary transition-colors duration-200`;

export default function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "FASHION",
    images: initialData?.images || [],
    stock: initialData?.stock || 0,
    specifications: {
      material: initialData?.specifications?.material || "Cotton",
      size: initialData?.specifications?.size || "S,M,L",
      color: initialData?.specifications?.color || "Black",
    },
    variants: initialData?.variants || [],
    isPublished: initialData?.isPublished || false,
    guestOrderEnabled: initialData?.guestOrderEnabled ?? true,
    minOrderQuantity: initialData?.minOrderQuantity || 1,
    maxOrderQuantity: initialData?.maxOrderQuantity || 999,
    shippingInfo: initialData?.shippingInfo || {
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      requiresSpecialHandling: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name?.trim()) throw new Error('Product name is required');
      if (!formData.description?.trim()) throw new Error('Product description is required');
      if (formData.description.length < 10) throw new Error('Description must be at least 10 characters long');
      if (!formData.category?.trim()) throw new Error('Product category is required');
      if (!formData.images?.length) throw new Error('At least one product image is required');
      if (formData.price < 0) throw new Error('Price must be non-negative');
      if (formData.stock < 0) throw new Error('Stock must be non-negative');

      // Create a copy of the form data and ensure images are properly formatted
      const submitData = {
        ...formData,
        // Don't modify the images array here, let the API handle it
        images: formData.images
      };

      console.log('Submitting data:', submitData);

      if (isEditing && initialData) {
        await updateProduct(initialData._id, submitData);
      } else {
        await createProduct(submitData);
      }
      router.push('/dashboard/products');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (value: string) => {
    const numericPrice = value === '' ? 0 : Number(value);
    const validPrice = isNaN(numericPrice) ? 0 : numericPrice;
    setFormData({ ...formData, price: validPrice });
  };

  const handleStockChange = (value: string) => {
    const numericStock = value === '' ? 0 : parseInt(value);
    const validStock = isNaN(numericStock) ? 0 : numericStock;
    setFormData({ ...formData, stock: validStock });
  };

  const handleImagesChange = (newImages: ProductImage[]) => {
    setFormData({ ...formData, images: newImages });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 text-white">
      {error && (
        <div className="animate-shake bg-red-500/15 text-red-300 p-4 rounded-lg border border-red-500/30 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-dark-secondary/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/10 
        hover:border-gold-primary/30 transition-all duration-300">
        <h3 className="text-2xl font-bold text-gold-primary mb-6 flex items-center tracking-wide">
          <span className="w-10 h-10 rounded-lg bg-gold-primary/20 flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Basic Information
        </h3>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputBaseClasses}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="group">
            <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={inputBaseClasses}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
                Price
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => handlePriceChange(e.target.value)}
                min="0"
                step="0.01"
                className={inputBaseClasses}
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock || 0}
                onChange={(e) => handleStockChange(e.target.value)}
                min="0"
                className={inputBaseClasses}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <ProductImages
        images={formData.images}
        onChange={handleImagesChange}
      />

      {/* Variants */}
      <ProductVariants
        variants={formData.variants || []}
        onChange={(variants) => setFormData({ ...formData, variants })}
      />

      {/* Specifications */}
      <div className="bg-dark-secondary/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/10 
        hover:border-gold-primary/30 transition-all duration-300">
        <h3 className="text-2xl font-bold text-gold-primary mb-6 flex items-center tracking-wide">
          <span className="w-10 h-10 rounded-lg bg-gold-primary/20 flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Specifications
        </h3>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
              Material
            </label>
            <input
              type="text"
              value={formData.specifications?.material}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    material: e.target.value,
                  },
                })
              }
              className={inputBaseClasses}
              required
            />
          </div>

          <div className="group">
            <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
              Size (comma-separated)
            </label>
            <input
              type="text"
              value={formData.specifications?.size}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    size: e.target.value,
                  },
                })
              }
              className={inputBaseClasses}
              placeholder="S,M,L"
              required
            />
          </div>

          <div className="group">
            <label className="block text-base font-semibold text-gold-primary/90 mb-2 tracking-wide">
              Color (comma-separated)
            </label>
            <input
              type="text"
              value={formData.specifications?.color}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    color: e.target.value,
                  },
                })
              }
              className={inputBaseClasses}
              placeholder="Black,White,Blue"
              required
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-dark-secondary/90 backdrop-blur-sm p-6 rounded-xl shadow-lg 
        border-2 border-white/20 hover:border-gold-primary/50 transition-all duration-300">
        <h3 className="text-2xl font-bold text-gold-primary mb-6 flex items-center tracking-wide">
          Settings
        </h3>

        <div className="space-y-4">
          <div className={checkboxContainerClasses}>
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-6 w-6 text-gold-primary focus:ring-2 focus:ring-gold-primary/50 
                border-2 border-white/40 rounded bg-transparent cursor-pointer
                checked:bg-gold-primary checked:border-gold-primary"
            />
            <label htmlFor="isPublished" className={checkboxLabelClasses}>
              Publish product
            </label>
          </div>

          <div className={checkboxContainerClasses}>
            <input
              type="checkbox"
              id="guestOrderEnabled"
              checked={formData.guestOrderEnabled}
              onChange={(e) => setFormData({ ...formData, guestOrderEnabled: e.target.checked })}
              className="h-6 w-6 text-gold-primary focus:ring-2 focus:ring-gold-primary/50 
                border-2 border-white/40 rounded bg-transparent cursor-pointer
                checked:bg-gold-primary checked:border-gold-primary"
            />
            <label htmlFor="guestOrderEnabled" className={checkboxLabelClasses}>
              Allow guest orders
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button Section */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-white/20 rounded-lg text-white font-semibold
            hover:bg-dark-secondary hover:border-white/40 transition-all duration-300
            flex items-center text-base tracking-wide"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-gold-primary to-gold-secondary 
            text-dark-primary rounded-lg font-bold text-base tracking-wide
            hover:shadow-lg hover:shadow-gold-primary/20 
            disabled:opacity-50 disabled:cursor-not-allowed
            transform hover:scale-102 active:scale-98
            transition-all duration-300 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isEditing ? "Update Product" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
