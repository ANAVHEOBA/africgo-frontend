"use client";

import { Suspense, memo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductList from "@/components/dashboard/products/ProductList";
import { tokenStorage } from '@/lib/auth/tokenStorage';

const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const ProductsPage = memo(function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getToken();
    const userType = tokenStorage.getUserType();
    
    if (!token || userType !== 'merchant') {
      console.log('No valid merchant token found, redirecting to login');
      router.replace('/login');
      return;
    }
  }, [router]);

  console.log("=== Products Page Debug ===");
  console.log("Rendering Products Page");

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
      <Suspense fallback={<LoadingFallback />}>
        <ProductList />
      </Suspense>
    </div>
  );
});

export default ProductsPage;
