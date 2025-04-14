'use client';

import { CartItem as CartItemType } from "@/lib/cart/types";
import { useState } from "react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  loading: boolean;
  storeSlug: string;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, loading, storeSlug }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(item._id, newQuantity);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-gold-primary font-semibold">₦{item.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Store: {storeSlug}</p>
          {item.variantData && item.variantData.length > 0 && (
            <div className="text-sm text-gray-500">
              {item.variantData.map((variant, index) => (
                <span key={index}>
                  {variant.name}: {variant.value}
                  {index < item.variantData.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-200 rounded-md">
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || quantity <= 1}
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-900">{quantity}</span>
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading}
          >
            +
          </button>
        </div>
        <button
          className="text-red-500 hover:text-red-600 disabled:opacity-50"
          onClick={() => onRemove(item._id)}
          disabled={loading}
        >
          Remove
        </button>
      </div>
    </div>
  );
} 