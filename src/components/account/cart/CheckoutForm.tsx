'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cart, CartItem } from '@/lib/cart/types';
import { Zone } from '@/lib/zones/api';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  cart: Cart;
  zones: Zone[];
}

interface GroupedItems {
  [storeId: string]: CartItem[];
}

export default function CheckoutForm({ cart, zones }: CheckoutFormProps) {
  console.log('CheckoutForm rendered with cart:', JSON.stringify(cart, null, 2));
  console.log('Available zones:', zones);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0] || null);

  useEffect(() => {
    console.log('Selected zone:', selectedZone);
  }, [selectedZone]);

  // Calculate totals
  const subtotal = cart.totalPrice;
  const deliveryFee = selectedZone?.deliveryPrice || 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission started');
    setLoading(true);
    setError('');

    if (!selectedZone) {
      setError('Please select a delivery zone');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      console.log('Form data collected:', Object.fromEntries(formData.entries()));

      // Create a single consolidated order
      const orderData = {
        deliveryAddress: {
          type: 'manual',
          manualAddress: {
            street: formData.get('deliveryStreet') as string,
            city: formData.get('deliveryCity') as string,
            state: formData.get('deliveryState') as string,
            country: formData.get('deliveryCountry') as string || 'Nigeria',
            postalCode: formData.get('deliveryPostalCode') as string,
            recipientName: formData.get('deliveryRecipientName') as string,
            recipientPhone: formData.get('deliveryRecipientPhone') as string,
            recipientEmail: formData.get('deliveryRecipientEmail') as string || undefined
          }
        },
        packageSize: formData.get('packageSize') as 'SMALL' | 'MEDIUM' | 'LARGE',
        isFragile: formData.get('isFragile') === 'true',
        isExpressDelivery: formData.get('isExpressDelivery') === 'true',
        requiresSpecialHandling: false,
        specialInstructions: formData.get('specialInstructions') as string || undefined,
        zoneId: selectedZone._id,
        paymentMethod: 'BANK_TRANSFER',
        consolidateDelivery: true
      };

      console.log('Sending consolidated order:', JSON.stringify(orderData, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://logistics-backend-1-s91j.onrender.com"}/api/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const text = await response.text();
      console.log('Raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed response:', data);
      } catch (err) {
        console.error('Failed to parse response:', err);
        throw new Error(`Invalid response format: ${text}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Get the first order ID for redirection
      if (data.data?.orders?.[0]?._id) {
        console.log('Redirecting to payment page...');
        router.push(`/account/orders/${data.data.orders[0]._id}/payment`);
      } else {
        throw new Error('No valid order data received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <form 
          id="checkout-form" 
          onSubmit={(e) => {
            console.log('Form submit event triggered');
            handleSubmit(e);
          }} 
          className="space-y-8 bg-white p-6 rounded-lg shadow-sm"
        >
          {/* Package Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Package Details</h3>
            
            {/* Zone Selection */}
            <div>
              <label htmlFor="zone" className="block text-lg font-medium text-gray-700 mb-2">
                Delivery Zone
              </label>
              <select
                id="zone"
                name="zone"
                value={selectedZone?._id || ''}
                onChange={(e) => {
                  const zone = zones.find((z) => z._id === e.target.value);
                  setSelectedZone(zone || null);
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              >
                <option value="">Select a delivery zone</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name} - ₦{zone.deliveryPrice.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Package Size */}
            <div>
              <label htmlFor="packageSize" className="block text-lg font-medium text-gray-700 mb-2">
                Package Size
              </label>
              <select
                id="packageSize"
                name="packageSize"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              >
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>

            {/* Package Options */}
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFragile"
                  name="isFragile"
                  value="true"
                  className="h-5 w-5 text-gold-primary focus:ring-gold-primary"
                />
                <label htmlFor="isFragile" className="ml-2 text-gray-700">
                  Fragile Package
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isExpressDelivery"
                  name="isExpressDelivery"
                  value="true"
                  className="h-5 w-5 text-gold-primary focus:ring-gold-primary"
                />
                <label htmlFor="isExpressDelivery" className="ml-2 text-gray-700">
                  Express Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Delivery Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deliveryRecipientName" className="block text-lg font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  id="deliveryRecipientName"
                  name="deliveryRecipientName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                />
              </div>
              
              <div>
                <label htmlFor="deliveryRecipientPhone" className="block text-lg font-medium text-gray-700 mb-2">
                  Recipient Phone
                </label>
                <input
                  type="tel"
                  id="deliveryRecipientPhone"
                  name="deliveryRecipientPhone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="deliveryRecipientEmail" className="block text-lg font-medium text-gray-700 mb-2">
                Recipient Email (Optional)
              </label>
              <input
                type="email"
                id="deliveryRecipientEmail"
                name="deliveryRecipientEmail"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>

            <div>
              <label htmlFor="deliveryStreet" className="block text-lg font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                id="deliveryStreet"
                name="deliveryStreet"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="deliveryCity" className="block text-lg font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="deliveryCity"
                  name="deliveryCity"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                />
              </div>
              
              <div>
                <label htmlFor="deliveryState" className="block text-lg font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="deliveryState"
                  name="deliveryState"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                />
              </div>
              
              <div>
                <label htmlFor="deliveryPostalCode" className="block text-lg font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="deliveryPostalCode"
                  name="deliveryPostalCode"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="deliveryCountry" className="block text-lg font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                id="deliveryCountry"
                name="deliveryCountry"
                defaultValue="Nigeria"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="specialInstructions" className="block text-lg font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-primary"
              placeholder="Any special handling instructions..."
            />
          </div>

          {/* Submit Button - Move it inside the form */}
          <button
            type="submit"
            disabled={loading || !selectedZone}
            onClick={() => console.log('Submit button clicked')}
            className={`w-full py-4 rounded-lg text-lg font-bold
              ${loading || !selectedZone
                ? 'bg-gold-primary/50 cursor-not-allowed'
                : 'bg-gold-primary hover:bg-gold-secondary'
              } text-white transition-colors`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
          
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div>
                  <p className="text-gray-900 font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                </div>
                <p className="text-gold-primary font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900 font-medium">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gold-primary">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 