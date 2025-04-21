'use client';

import { useState, useEffect } from 'react';
import { StorePaymentDetails } from '@/lib/stores/types';
import { getPaymentDetails, createPaymentDetails, updatePaymentDetails } from '@/lib/stores/api';

export default function StorePaymentDetails() {
  const [paymentDetails, setPaymentDetails] = useState<StorePaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = async () => {
    try {
      const details = await getPaymentDetails();
      setPaymentDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        accountName: formData.get('accountName') as string,
        accountNumber: formData.get('accountNumber') as string,
        bankName: formData.get('bankName') as string
      };

      const result = paymentDetails 
        ? await updatePaymentDetails(data)
        : await createPaymentDetails(data);

      setPaymentDetails(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading payment details...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Set up your bank account details for receiving payments from orders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            name="accountName"
            id="accountName"
            defaultValue={paymentDetails?.accountName}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-primary focus:ring-gold-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            id="accountNumber"
            defaultValue={paymentDetails?.accountNumber}
            required
            pattern="[0-9]*"
            maxLength={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-primary focus:ring-gold-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            defaultValue={paymentDetails?.bankName}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-primary focus:ring-gold-primary sm:text-sm"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`inline-flex justify-center rounded-md border border-transparent bg-gold-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gold-secondary focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Saving...' : 'Save Payment Details'}
        </button>
      </form>
    </div>
  );
} 