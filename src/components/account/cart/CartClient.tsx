'use client';

import { useState, useEffect } from "react";
import { Cart } from "@/lib/cart/types";
import { addToCart, updateCartItem, removeCartItem, clearCart, getCart } from "@/lib/cart/api";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }

        const cartData = await getCart();
        setCart(cartData);
      } catch (err) {
        if (err instanceof Error && err.message.includes("Invalid token")) {
          // Clear invalid token and redirect to login
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch cart");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await addToCart({ productId, quantity });
      setCart(updatedCart);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Invalid token")) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setError(err instanceof Error ? err.message : "Failed to add item to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await updateCartItem(itemId, { quantity });
      setCart(updatedCart);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Invalid token")) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setError(err instanceof Error ? err.message : "Failed to update cart item");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Invalid token")) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setError(err instanceof Error ? err.message : "Failed to remove item from cart");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await clearCart();
      setCart(updatedCart);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Invalid token")) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setError(err instanceof Error ? err.message : "Failed to clear cart");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    router.push('/account/cart/checkout');
  };

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CartList
          items={cart.items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          loading={loading}
          storeSlug={cart.items[0].storeSlug}
        />
      </div>
      <div className="lg:col-span-1">
        <CartSummary
          totalPrice={cart.totalPrice}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}
          loading={loading}
        />
      </div>
    </div>
  );
} 