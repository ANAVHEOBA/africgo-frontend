'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderForm from '@/components/account/orders/OrderForm';
import { getStoreBySlug, getStoreProducts } from '@/lib/stores/api';
import { Store, Product } from '@/lib/stores/types';

export default function OrderFormContent() {
  const searchParams = useSearchParams();
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storeSlug = searchParams.get('storeSlug');
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  useEffect(() => {
    async function fetchData() {
      if (!storeSlug || !productId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        // Get the store by slug
        const storeData = await getStoreBySlug(storeSlug);
        setStore(storeData);

        // Then get the store's products
        const { products } = await getStoreProducts(storeSlug);
        const productData = products.find((p: Product) => p._id === productId);
        
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [storeSlug, productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    );
  }

  if (error || !product || !store || !storeSlug || !productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error || 'Invalid order parameters'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderForm
        storeId={store._id}
        productId={productId}
        quantity={quantity}
        productPrice={product.price}
        storeSlug={storeSlug}
      />
    </div>
  );
} 