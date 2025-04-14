'use client';

import { CartItem as CartItemType } from "@/lib/cart/types";
import CartItemComponent from "./CartItem";

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  loading: boolean;
  storeSlug: string;
}

export default function CartList({ items, onUpdateQuantity, onRemoveItem, loading, storeSlug }: CartListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemComponent
          key={item._id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
          loading={loading}
          storeSlug={storeSlug}
        />
      ))}
    </div>
  );
} 