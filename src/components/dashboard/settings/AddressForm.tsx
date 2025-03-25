"use client";

import { useState } from 'react';
import { createAddress, updateAddress } from '@/lib/stores/api';
import { Address, CreateAddressData } from '@/lib/stores/types';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddressFormProps {
  existingAddress?: Address | null;
  onClose: () => void;
}

export default function AddressForm({ existingAddress, onClose }: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressData>({
    street: existingAddress?.street || '',
    city: existingAddress?.city || '',
    state: existingAddress?.state || '',
    country: existingAddress?.country || '',
    postalCode: existingAddress?.postalCode || '',
    isDefault: existingAddress?.isDefault || false,
    label: existingAddress?.label || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingAddress) {
        await updateAddress({
          ...formData,
          addressId: existingAddress._id,
        });
        toast.success('Address updated successfully');
      } else {
        await createAddress(formData);
        toast.success('Address created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gradient-to-b from-white to-gold-50/30 rounded-xl shadow-2xl border border-gold-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-800 to-gold-600 rounded-t-xl px-6 py-5 flex justify-between items-center border-b border-gold-500">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            {existingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/90 hover:text-white transition-colors hover:bg-gold-700/50 p-1.5 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6 bg-white/80">
          {/* Label */}
          <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5">
            <label htmlFor="label" className="block text-sm font-semibold text-gold-900 mb-2">
              Label
            </label>
            <input
              type="text"
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              className="block w-full rounded-md border-gold-300 bg-white/90 shadow-sm focus:border-gold-500 focus:ring-gold-500 transition-all duration-200"
              required
            />
          </div>

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

          {/* Default Checkbox */}
          <div className="bg-gradient-to-r from-gold-100/50 to-gold-50/50 rounded-lg shadow-md border border-gold-200 p-5 flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-5 w-5 text-gold-600 focus:ring-gold-500 border-gold-300 rounded transition-all duration-200"
            />
            <label htmlFor="isDefault" className="ml-3 text-sm font-medium text-gold-900">
              Set as default address
            </label>
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
                ? 'Update Address' 
                : 'Save Address'
            }
          </button>
        </div>
      </form>
    </div>
  );
} 