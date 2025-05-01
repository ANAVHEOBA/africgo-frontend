import { useState } from 'react';
import { Store } from '@/lib/stores/types';
import { useRouter } from 'next/navigation';

interface StoreManagementProps {
  store: Store;
  onUpdate: (updatedStore: Store) => void;
}

export default function StoreManagement({ store, onUpdate }: StoreManagementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivateStore = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        onUpdate(data.data);
      } else {
        setError(data.message || "Failed to activate store");
      }
    } catch (err) {
      console.error("Store activation error:", err);
      setError("Failed to activate store");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your store? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        router.push("/dashboard/create-store");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete store");
      }
    } catch (err) {
      console.error("Store deletion error:", err);
      setError("Failed to delete store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Store Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store's status and perform critical actions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Store Status</h3>
            <p className="text-sm text-gray-500">
              Current status: <span className="font-medium">{store.status}</span>
            </p>
          </div>
          {store.status === "INACTIVE" && (
            <button
              onClick={handleActivateStore}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Activating..." : "Activate Store"}
            </button>
          )}
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-sm font-medium text-red-900">Danger Zone</h3>
          <p className="mt-1 text-sm text-red-500">
            Once you delete your store, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteStore}
            disabled={loading}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Store"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 