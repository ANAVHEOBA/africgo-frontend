'use client';

import StorePaymentDetails from '@/components/dashboard/settings/StorePaymentDetails';

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Payment Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your payment methods and payout details. These settings determine how you receive payments from orders.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <StorePaymentDetails />
        </div>
      </div>

      {/* Space for future payment-related settings */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Additional Payment Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            More payment settings and options will be available here soon.
          </p>
        </div>
      </div>
    </div>
  );
} 