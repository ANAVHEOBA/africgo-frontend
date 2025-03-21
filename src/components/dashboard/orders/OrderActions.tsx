"use client";

import { useState } from 'react';
import { markOrderAsReady } from '@/lib/stores/api';
import { useRouter } from 'next/navigation';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

export default function OrderActions({ 
  orderId, 
  currentStatus, 
  onStatusUpdate 
}: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMarkAsReady = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await markOrderAsReady(orderId);
      
      setSuccess(true);
      onStatusUpdate(); // Refresh the parent component
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication required') {
        router.push('/login');
      } else {
        setError('Failed to update order status. Please try again.');
      }
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleMarkAsReady}
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg
          hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed
          transition-colors"
      >
        {loading ? 'Updating...' : 'Mark as Ready for Pickup'}
      </button>
      
      {success && (
        <p className="mt-2 text-sm text-green-500">
          Order successfully marked as ready for pickup!
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 