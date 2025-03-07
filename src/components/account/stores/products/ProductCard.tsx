"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/stores/types";
import OrderForm from "@/components/account/orders/OrderForm";

interface ProductCardProps {
  product: Product;
  storeId: string;
}

export default function ProductCard({ product, storeId }: ProductCardProps) {
  const router = useRouter();
  const isMounted = useRef(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Use intersection observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`product-${product._id}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [product._id]);

  // Set image URL
  useEffect(() => {
    const url =
      process.env.NODE_ENV === "development"
        ? `https://picsum.photos/seed/${product._id}/400/300`
        : product.images[0] || "";

    setImageUrl(url);

    return () => {
      isMounted.current = false;
    };
  }, [product._id, product.images]);

  const handleImageLoad = useCallback(() => {
    if (isMounted.current) {
      setIsImageLoading(false);
    }
  }, []);

  const handleImageError = useCallback(() => {
    if (isMounted.current) {
      setImageError(true);
      setIsImageLoading(false);
    }
  }, []);

  const handleOrder = () => {
    setShowOrderForm(true);
  };

  return (
    <>
      <div
        id={`product-${product._id}`}
        className="bg-black/5 rounded-lg shadow-md overflow-hidden border border-gold-primary/20 
          hover:border-gold-primary transition-all hover:shadow-lg"
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
                  isImageLoading ? "opacity-0" : "opacity-100"
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
              {/* ${Number(product.price).toFixed(2)} */}₦
              {product.price.toLocaleString(undefined, {
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

          {/* Order Button */}
          <button
            className="w-full py-2 bg-gold-primary text-white rounded-lg 
              hover:bg-gold-secondary transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            onClick={handleOrder}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <OrderForm
              storeId={storeId}
              productId={product._id}
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
