"use client";

import { useState, useEffect } from 'react';
import { createStoreAddress, updateStoreAddress } from '@/lib/stores/api';
import { StoreAddress } from '@/lib/stores/types';
import { toast } from 'react-hot-toast';

interface StoreAddressFormProps {
  existingAddress?: StoreAddress;
}

export default function StoreAddressForm({ existingAddress }: StoreAddressFormProps) {
  const [formData, setFormData] = useState({
    street: existingAddress?.street || '',
    city: existingAddress?.city || '',
    state: existingAddress?.state || '',
    country: existingAddress?.country || '',
    postalCode: existingAddress?.postalCode || '',
    isDefault: existingAddress?.isDefault || true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingAddress) {
        await updateStoreAddress({
          ...formData,
          addressId: existingAddress._id
        });
        toast.success('Store address updated successfully');
      } else {
        await createStoreAddress(formData);
        toast.success('Store address created successfully');
      }
    } catch (error) {
      console.error('Error saving store address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save store address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-b from-white to-gold-50/30 rounded-xl shadow-2xl border border-gold-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-800 to-gold-600 px-8 py-5 rounded-t-xl border-b border-gold-500">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            {existingAddress ? 'Edit Store Address' : 'Add Store Address'}
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6 bg-white/80">
          {/* Street Address */}
          <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
            <label htmlFor="street" className="block text-sm font-semibold text-gold-900 mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
              required
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
              <label htmlFor="city" className="block text-sm font-semibold text-gold-900 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
              <label htmlFor="state" className="block text-sm font-semibold text-gold-900 mb-2">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Country & Postal Code */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
              <label htmlFor="country" className="block text-sm font-semibold text-gold-900 mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gold-900 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gradient-to-b from-gold-50 to-gold-100/50 border-t border-gold-200 rounded-b-xl">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-medium transition-all duration-300
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-gold-800 to-gold-600 hover:from-gold-900 hover:to-gold-700 text-white shadow-lg hover:shadow-xl active:scale-[0.99]'
              }`}
          >
            {isSubmitting 
              ? 'Saving...' 
              : existingAddress 
                ? 'Update Store Address' 
                : 'Save Store Address'
            }
          </button>
        </div>
      </div>
    </form>
  );
} 