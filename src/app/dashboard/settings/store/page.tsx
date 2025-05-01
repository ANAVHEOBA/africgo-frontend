'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/lib/stores/types';
import { getMyStore } from '@/lib/stores/api';
import StoreInformation from '@/components/dashboard/settings/StoreInformation';
import StoreManagement from '@/components/dashboard/settings/StoreManagement';

export default function StoreSettingsPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);
        const storeData = await getMyStore();
        setStore(storeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store data');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleStoreUpdate = (updatedStore: Store) => {
    setStore(updatedStore);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Store not found</h2>
          <p className="mt-2 text-gray-600">The requested store could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Store Settings</h1>
          
          <div className="space-y-8">
            <StoreInformation store={store} onUpdate={handleStoreUpdate} />
            <StoreManagement store={store} onUpdate={handleStoreUpdate} />
            
            {/* Add more settings sections here */}
          </div>
        </div>
      </div>
    </div>
  );
} 