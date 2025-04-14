"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/stores/types";
import { addToCart } from "@/lib/cart/api";
import OrderForm from "@/components/account/orders/OrderForm";

interface ProductImage {
  url: string;
  alt?: string;
  _id?: string;
  publicId?: string;
}

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  storeId: string;
}

export default function ProductCard({ product, storeSlug, storeId }: ProductCardProps) {
  const router = useRouter();
  const isMounted = useRef(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image URL handling effect
  useEffect(() => {
    if (!product.images?.length) {
      const placeholderUrl = `https://picsum.photos/seed/${product._id}/400/300`;
      setImageUrl(placeholderUrl);
      setIsImageLoading(false);
      return;
    }

    const firstImage = product.images[0] as (string | ProductImage);
    let imageUrl = '';

    if (typeof firstImage === 'string') {
      imageUrl = firstImage;
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      imageUrl = firstImage.url;
    }
    
    if (!imageUrl) {
      setImageError(true);
      setIsImageLoading(false);
      return;
    }

    setImageUrl(imageUrl);
  }, [product._id, product.images]);

  const handleImageLoad = useCallback(() => {
    if (isMounted.current) {
      setIsImageLoading(false);
      setImageLoaded(true);
    }
  }, []);

  const handleImageError = useCallback(() => {
    if (isMounted.current) {
      setImageError(true);
      setIsImageLoading(false);
      setImageLoaded(false);
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setError(null);
      await addToCart({
        productId: product._id,
        quantity: quantity
      });
      router.push('/account/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error instanceof Error ? error.message : "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <div
        id={`product-${product._id}`}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => {
                setIsImageLoading(false);
                setImageLoaded(true);
              }}
              onError={handleImageError}
              priority={true}
            />
          )}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-primary" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Failed to load image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <h3
            className="font-semibold text-lg truncate text-gray-900"
            title={product.name}
          >
            {product.name}
          </h3>

          <p
            className="text-gray-700 text-sm line-clamp-2"
            title={product.description}
          >
            {product.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gold-primary">
              ₦{product.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-sm text-gray-700">
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-2">
              <label
                htmlFor={`quantity-${product._id}`}
                className="text-sm text-gray-700"
              >
                Quantity:
              </label>
              <select
                id={`quantity-${product._id}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="w-full bg-gold-primary text-white py-2 rounded hover:bg-gold-secondary 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => setShowOrderForm(true)}
              className="w-full border border-gold-primary text-gold-primary py-2 rounded 
                hover:bg-gold-primary/10 transition-colors font-medium"
            >
              Order Now
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <OrderForm
              storeId={storeId}
              storeSlug={storeSlug}
              productId={product._id}
              productPrice={product.price}
              quantity={quantity}
              onSuccess={() => setShowOrderForm(false)}
              onCancel={() => setShowOrderForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
