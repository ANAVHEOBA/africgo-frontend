"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { placeOrder } from "@/lib/orders/api";
import { getDeliveryZones, Zone } from "@/lib/zones/api";
import { getStoreProducts } from "@/lib/stores/api";
import { CreateOrderData } from "@/lib/orders/types";
import { Store } from "@/lib/stores/types";

interface OrderFormProps {
  storeId: string;
  productId: string;
  quantity: number;
  productPrice: number;
  storeSlug: string;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export default function OrderForm({
  storeId,
  productId,
  quantity,
  productPrice,
  storeSlug,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Calculate total price
  const subtotal = productPrice * quantity;
  const deliveryFee = selectedZone?.deliveryPrice || 0;
  const total = subtotal + deliveryFee;

  // Fetch delivery zones when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch delivery zones
        console.log('Fetching delivery zones...');
        const zonesData = await getDeliveryZones();
        console.log('Delivery zones received:', zonesData);
        
        if (!Array.isArray(zonesData)) {
          throw new Error('Invalid zones data received');
        }
        
        setZones(zonesData);
        if (zonesData.length > 0) {
          setSelectedZone(zonesData[0]);
        } else {
          console.warn('No delivery zones available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch required data');
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!storeId || !selectedZone) {
      setError("Missing required information");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      
      const orderData: CreateOrderData = {
        storeId: storeId,
        items: [{
          productId: productId,
          quantity: quantity,
        }],
        deliveryAddress: {
          type: "manual",
          manualAddress: {
            street: formData.get("deliveryStreet") as string,
            city: formData.get("deliveryCity") as string,
            state: formData.get("deliveryState") as string,
            country: formData.get("deliveryCountry") as string || "Nigeria",
            postalCode: formData.get("deliveryPostalCode") as string,
            recipientName: formData.get("deliveryRecipientName") as string,
            recipientPhone: formData.get("deliveryRecipientPhone") as string,
            recipientEmail: formData.get("deliveryRecipientEmail") as string || undefined
          }
        },
        packageSize: formData.get("packageSize") as "SMALL" | "MEDIUM" | "LARGE",
        isFragile: formData.get("isFragile") === "true",
        isExpressDelivery: formData.get("isExpressDelivery") === "true",
        specialInstructions: formData.get("specialInstructions") as string || undefined,
        zoneId: selectedZone._id,
        paymentMethod: "BANK_TRANSFER",
      };

      console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));
      const order = await placeOrder(orderData);
      
      router.push(`/account/orders/${order._id}/payment`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg border-2 border-gray-700"
    >
      <h2 className="text-3xl font-bold text-gold-primary mb-8">Place Order</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Package Details */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gold-primary">Package Details</h3>
          
          {/* Zone Selection */}
          <div>
            <label htmlFor="zone" className="block text-lg font-bold text-white mb-2">
              Delivery Zone
            </label>
            <select
              id="zone"
              name="zone"
              value={selectedZone?._id || ""}
              onChange={(e) => {
                const zone = zones.find((z) => z._id === e.target.value);
                setSelectedZone(zone || null);
              }}
              required
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            >
              <option value="">Select a delivery zone</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id} className="text-xl">
                  {zone.name} - ₦{zone.deliveryPrice.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Package Size */}
          <div>
            <label htmlFor="packageSize" className="block text-lg font-bold text-white mb-2">
              Package Size
            </label>
            <select
              id="packageSize"
              name="packageSize"
              required
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
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
              <label htmlFor="isFragile" className="ml-2 text-lg font-semibold text-white">
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
              <label htmlFor="isExpressDelivery" className="ml-2 text-lg font-semibold text-white">
                Express Delivery
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gold-primary">Delivery Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deliveryRecipientName" className="block text-lg font-bold text-white mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                id="deliveryRecipientName"
                name="deliveryRecipientName"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                  text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryRecipientPhone" className="block text-lg font-bold text-white mb-2">
                Recipient Phone
              </label>
              <input
                type="tel"
                id="deliveryRecipientPhone"
                name="deliveryRecipientPhone"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                  text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryRecipientEmail" className="block text-lg font-bold text-white mb-2">
              Recipient Email (Optional)
            </label>
            <input
              type="email"
              id="deliveryRecipientEmail"
              name="deliveryRecipientEmail"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>

          <div>
            <label htmlFor="deliveryStreet" className="block text-lg font-bold text-white mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="deliveryStreet"
              name="deliveryStreet"
              required
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="deliveryCity" className="block text-lg font-bold text-white mb-2">
                City
              </label>
              <input
                type="text"
                id="deliveryCity"
                name="deliveryCity"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                  text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryState" className="block text-lg font-bold text-white mb-2">
                State
              </label>
              <input
                type="text"
                id="deliveryState"
                name="deliveryState"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                  text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryPostalCode" className="block text-lg font-bold text-white mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="deliveryPostalCode"
                name="deliveryPostalCode"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                  text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryCountry" className="block text-lg font-bold text-white mb-2">
              Country
            </label>
            <input
              type="text"
              id="deliveryCountry"
              name="deliveryCountry"
              defaultValue="Nigeria"
              required
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
                text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label htmlFor="specialInstructions" className="block text-lg font-bold text-white mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
              text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            placeholder="Any special handling instructions..."
          />
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-lg font-bold text-white mb-2">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            required
            defaultValue="BANK_TRANSFER"
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg
              text-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {/* Price Summary */}
        {selectedZone && (
          <div className="border-t-2 border-gray-700 pt-6 mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">Subtotal:</span>
              <span className="text-2xl font-bold text-gold-primary">₦{(productPrice * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">Delivery Fee:</span>
              <span className="text-2xl font-bold text-gold-primary">₦{selectedZone.deliveryPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">Total:</span>
              <span className="text-3xl font-bold text-gold-primary">₦{((productPrice * quantity) + selectedZone.deliveryPrice).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-6 mt-8">
          <button
            type="submit"
            disabled={loading || !selectedZone}
            className={`flex-1 px-8 py-4 rounded-lg text-xl font-bold
              ${loading || !selectedZone
                ? "bg-gold-primary/50 cursor-not-allowed"
                : "bg-gold-primary hover:bg-gold-secondary"
              } text-gray-900 transition-colors`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-8 py-4 rounded-lg text-xl font-bold
              bg-gray-800 border-2 border-gray-700 text-white
              hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-lg font-bold mt-4">{error}</p>
        )}
      </form>
    </motion.div>
  );
}