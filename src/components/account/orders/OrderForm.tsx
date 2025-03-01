"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { placeOrder } from "@/lib/orders/api"
import { CreateOrderData } from "@/lib/orders/types"

interface OrderFormProps {
  storeId: string;
  productId: string;
  quantity: number;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export default function OrderForm({ 
  storeId, 
  productId, 
  quantity,
  onSuccess,
  onCancel 
}: OrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const orderData: CreateOrderData = {
      storeId,
      items: [{ productId, quantity }],
      deliveryAddress: {
        type: 'manual',
        manualAddress: {
          street: formData.get('street') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          country: formData.get('country') as string,
          postalCode: formData.get('postalCode') as string,
          recipientName: formData.get('recipientName') as string,
          recipientPhone: formData.get('recipientPhone') as string,
        }
      },
      pickupAddress: {
        type: 'manual',
        manualAddress: {
          street: formData.get('pickupStreet') as string,
          city: formData.get('pickupCity') as string,
          state: formData.get('pickupState') as string,
          country: formData.get('pickupCountry') as string,
          postalCode: formData.get('pickupPostalCode') as string,
        }
      },
      packageSize: formData.get('packageSize') as 'SMALL' | 'MEDIUM' | 'LARGE',
      isFragile: formData.get('isFragile') === 'true',
      isExpressDelivery: formData.get('isExpressDelivery') === 'true',
      requiresSpecialHandling: formData.get('requiresSpecialHandling') === 'true',
      specialInstructions: formData.get('specialInstructions') as string,
    }

    try {
      const order = await placeOrder(orderData)
      onSuccess?.(order._id)
      router.push(`/account/orders/${order._id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-dark-secondary p-6 rounded-lg border border-white/10"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Place Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Delivery Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-white mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="recipientPhone" className="block text-sm font-medium text-white mb-2">
                Recipient Phone
              </label>
              <input
                type="tel"
                id="recipientPhone"
                name="recipientPhone"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-white mb-2">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-white mb-2">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-white mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-white mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Package Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="packageSize" className="block text-sm font-medium text-white mb-2">
                Package Size
              </label>
              <select
                id="packageSize"
                name="packageSize"
                required
                className="w-full px-4 py-2 bg-dark-primary border border-white/10 rounded-lg
                  text-white
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              >
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFragile"
                name="isFragile"
                value="true"
                className="w-4 h-4 border-white/10 rounded
                  text-gold-primary focus:ring-gold-primary"
              />
              <label htmlFor="isFragile" className="text-sm text-white">
                Fragile
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isExpressDelivery"
                name="isExpressDelivery"
                value="true"
                className="w-4 h-4 border-white/10 rounded
                  text-gold-primary focus:ring-gold-primary"
              />
              <label htmlFor="isExpressDelivery" className="text-sm text-white">
                Express Delivery
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresSpecialHandling"
                name="requiresSpecialHandling"
                value="true"
                className="w-4 h-4 border-white/10 rounded
                  text-gold-primary focus:ring-gold-primary"
              />
              <label htmlFor="requiresSpecialHandling" className="text-sm text-white">
                Special Handling
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-white mb-2">
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
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg font-medium
              ${loading 
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

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </form>
    </motion.div>
  )
} 