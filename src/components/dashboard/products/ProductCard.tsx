"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, ProductStatus } from "@/lib/products/types";
import { deleteProduct, updateProduct } from "@/lib/products/api";

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const router = useRouter();
  const isMounted = useRef(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

  // Set image URL only once when component mounts
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

  const handleEdit = () => {
    router.push(`/dashboard/products/${product._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProduct(product._id);
      onDelete();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublished = async () => {
    try {
      setIsUpdating(true);
      await updateProduct(product._id, {
        isPublished: !product.isPublished,
      });
      onDelete(); // Refresh the list
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-gold-primary/20 text-gold-primary";
      case ProductStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800";
      case ProductStatus.DISCONTINUED:
        return "bg-gray-800/10 text-gray-800";
      default:
        return "bg-gray-800/10 text-gray-800";
    }
  };

  return (
    <div
      id={`product-${product._id}`}
      className="bg-black/5 rounded-lg shadow-md overflow-hidden border border-gold-primary/20 hover:border-gold-primary transition-all hover:shadow-lg"
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

        {/* Status Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            product.status
          )}`}
        >
          {product.status}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
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
            ₦{product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-700">Stock: {product.stock}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gold-primary/10">
          <button
            onClick={togglePublished}
            disabled={isUpdating}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              product.isPublished
                ? "bg-gold-primary text-white hover:bg-gold-secondary"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isUpdating
              ? "Updating..."
              : product.isPublished
              ? "Published"
              : "Draft"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gold-primary hover:bg-gold-primary/10 rounded transition-colors"
            >
              <span className="sr-only">Edit</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <span className="sr-only">Delete</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
