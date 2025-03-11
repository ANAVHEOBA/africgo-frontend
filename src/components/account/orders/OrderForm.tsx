"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { placeOrder } from "@/lib/orders/api";
import { getDeliveryZones, Zone } from "@/lib/zones/api";
import { CreateOrderData } from "@/lib/orders/types";

interface OrderFormProps {
  storeId: string;
  productId: string;
  quantity: number;
  productPrice: number;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export default function OrderForm({
  storeId,
  productId,
  quantity,
  productPrice,
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
    async function fetchZones() {
      try {
        const zonesData = await getDeliveryZones();
        setZones(zonesData);
        if (zonesData.length > 0) {
          setSelectedZone(zonesData[0]);
        }
      } catch (error) {
        setError('Failed to fetch delivery zones');
      }
    }
    fetchZones();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Submit order form with:', {
      storeId,
      productId,
      quantity,
      selectedZone,
      token: localStorage.getItem("token") ? "exists" : "missing"
    });
    
    if (!selectedZone) {
      setError('Please select a delivery zone');
      return;
    }

    // Validate MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    
    console.log('Validating IDs:', {
      storeId,
      isValidStoreId: isValidObjectId(storeId),
      productId,
      isValidProductId: isValidObjectId(productId)
    });
    
    if (!isValidObjectId(storeId)) {
      setError('Invalid store ID format');
      console.error('Invalid storeId:', storeId);
      return;
    }

    if (!isValidObjectId(productId)) {
      setError('Invalid product ID format');
      console.error('Invalid productId:', productId);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const orderData: CreateOrderData = {
      storeId,
      items: [{
        productId,
        quantity
      }],
      specialInstructions: formData.get("specialInstructions") as string || undefined,
      deliveryAddress: {
        type: "manual",
        manualAddress: {
          street: formData.get("deliveryStreet") as string,
          city: formData.get("deliveryCity") as string,
          state: formData.get("deliveryState") as string,
          country: formData.get("deliveryCountry") as string,
          postalCode: formData.get("deliveryPostalCode") as string,
          recipientName: formData.get("deliveryRecipientName") as string,
          recipientPhone: formData.get("deliveryRecipientPhone") as string
        }
      },
      pickupAddress: {
        type: "manual",
        manualAddress: {
          street: formData.get("pickupStreet") as string,
          city: formData.get("pickupCity") as string,
          state: formData.get("pickupState") as string,
          country: formData.get("pickupCountry") as string,
          postalCode: formData.get("pickupPostalCode") as string,
          recipientName: formData.get("pickupRecipientName") as string,
          recipientPhone: formData.get("pickupRecipientPhone") as string
        }
      },
      packageSize: formData.get("packageSize") as "SMALL" | "MEDIUM" | "LARGE" || "MEDIUM",
      isFragile: formData.get("isFragile") === "true",
      isExpressDelivery: formData.get("isExpressDelivery") === "true",
      zoneId: selectedZone?._id || ""
    };

    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
    
    try {
      const order = await placeOrder(orderData);
      console.log('Order placed successfully:', order);
      onSuccess?.(order._id);
      router.push(`/account/orders/${order._id}`);
    } catch (error) {
      console.error('Order error details:', error);
      setError(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-dark-secondary p-6 rounded-lg border border-white/10"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Place Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Zone Selection */}
        <div>
          <label
            htmlFor="zone"
            className="block text-sm font-medium text-white mb-2"
          >
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
            className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
              text-white
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
          >
            <option value="">Select a delivery zone</option>
            {zones.map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.name} - ₦{zone.deliveryPrice.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Package Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Package Details</h3>
          
          <div>
            <label htmlFor="packageSize" className="block text-sm font-medium text-white mb-2">
              Package Size
            </label>
            <select
              id="packageSize"
              name="packageSize"
              required
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM" selected>Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFragile"
                name="isFragile"
                value="true"
                className="h-4 w-4 text-gold-primary focus:ring-gold-primary"
              />
              <label htmlFor="isFragile" className="ml-2 text-sm text-white">
                Fragile Package
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isExpressDelivery"
                name="isExpressDelivery"
                value="true"
                className="h-4 w-4 text-gold-primary focus:ring-gold-primary"
              />
              <label htmlFor="isExpressDelivery" className="ml-2 text-sm text-white">
                Express Delivery
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Delivery Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryRecipientName" className="block text-sm font-medium text-white mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                id="deliveryRecipientName"
                name="deliveryRecipientName"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryRecipientPhone" className="block text-sm font-medium text-white mb-2">
                Recipient Phone
              </label>
              <input
                type="tel"
                id="deliveryRecipientPhone"
                name="deliveryRecipientPhone"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="deliveryStreet" className="block text-sm font-medium text-white mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="deliveryStreet"
              name="deliveryStreet"
              required
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="deliveryCity" className="block text-sm font-medium text-white mb-2">
                City
              </label>
              <input
                type="text"
                id="deliveryCity"
                name="deliveryCity"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryState" className="block text-sm font-medium text-white mb-2">
                State
              </label>
              <input
                type="text"
                id="deliveryState"
                name="deliveryState"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryPostalCode" className="block text-sm font-medium text-white mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="deliveryPostalCode"
                name="deliveryPostalCode"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryCountry" className="block text-sm font-medium text-white mb-2">
                Country
              </label>
              <input
                type="text"
                id="deliveryCountry"
                name="deliveryCountry"
                defaultValue="Nigeria"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
        </div>

        {/* Pickup Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Pickup Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickupRecipientName" className="block text-sm font-medium text-white mb-2">
                Sender Name
              </label>
              <input
                type="text"
                id="pickupRecipientName"
                name="pickupRecipientName"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="pickupRecipientPhone" className="block text-sm font-medium text-white mb-2">
                Sender Phone
              </label>
              <input
                type="tel"
                id="pickupRecipientPhone"
                name="pickupRecipientPhone"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="pickupStreet" className="block text-sm font-medium text-white mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="pickupStreet"
              name="pickupStreet"
              required
              className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pickupCity" className="block text-sm font-medium text-white mb-2">
                City
              </label>
              <input
                type="text"
                id="pickupCity"
                name="pickupCity"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="pickupState" className="block text-sm font-medium text-white mb-2">
                State
              </label>
              <input
                type="text"
                id="pickupState"
                name="pickupState"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            
            <div>
              <label htmlFor="pickupPostalCode" className="block text-sm font-medium text-white mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="pickupPostalCode"
                name="pickupPostalCode"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickupCountry" className="block text-sm font-medium text-white mb-2">
                Country
              </label>
              <input
                type="text"
                id="pickupCountry"
                name="pickupCountry"
                defaultValue="Nigeria"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-medium text-white mb-2"
          >
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            rows={3}
            className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
            placeholder="Any special instructions for handling or delivery..."
          />
        </div>

        {/* Total Price Display */}
        {selectedZone && (
          <div className="border-t border-white/10 pt-4 mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Subtotal:</span>
              <span className="text-gold-primary">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Delivery Fee:</span>
              <span className="text-gold-primary">
                ₦{deliveryFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-white">Total:</span>
              <span className="text-gold-primary">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !selectedZone}
            className={`flex-1 px-6 py-3 rounded-lg font-medium
              ${
                loading || !selectedZone
                  ? "bg-gold-primary/50 cursor-not-allowed"
                  : "bg-gold-primary hover:bg-gold-secondary"
              } text-dark-primary transition-colors`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg font-medium
              bg-dark-primary border border-white/10 text-white
              hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </motion.div>
  );
}