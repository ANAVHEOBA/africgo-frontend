"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardStats from "@/components/dashboard/stats/DashboardStats";

interface StoreData {
  _id: string;
  storeName: string;
  description: string;
  category: string;
  status: string;
  metrics: {
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
  contactInfo: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  settings?: {
    allowRatings: boolean;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkStore = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stores/my-store`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Store check response:", data);

        if (response.ok && data.success) {
          setStoreData(data.data);
        } else {
          setStoreData(null);
        }
      } catch (error) {
        console.error("Error checking store:", error);
        setError("Failed to load store data");
      } finally {
        setLoading(false);
      }
    };

    checkStore();
  }, []);

  const handleUpdateStore = async (updateData: Partial<StoreData>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setStoreData(data.data);
      } else {
        setError(data.message || "Failed to update store");
      }
    } catch (err) {
      console.error("Store update error:", err);
      setError("Failed to update store");
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
    }
  };

  const handleUpdateSettings = async (settings: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ settings }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setStoreData(data.data);
      } else {
        setError(data.message || "Failed to update settings");
      }
    } catch (err) {
      console.error("Settings update error:", err);
      setError("Failed to update settings");
    }
  };

  const handleActivateStore = async () => {
    try {
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
        setStoreData(data.data);
      } else {
        setError(data.message || "Failed to activate store");
      }
    } catch (err) {
      console.error("Store activation error:", err);
      setError("Failed to activate store");
    }
  };

  const fetchStoreMetrics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/metrics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        // Update store metrics in state
        setStoreData((prev) => (prev ? { ...prev, metrics: data.data } : null));
      } else {
        console.error("Failed to fetch metrics:", data.message);
      }
    } catch (err) {
      console.error("Metrics fetch error:", err);
    }
  };

  // Add this to your useEffect to fetch metrics periodically
  useEffect(() => {
    if (storeData) {
      const interval = setInterval(fetchStoreMetrics, 60000); // Fetch every minute
      return () => clearInterval(interval);
    }
  }, [storeData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    );
  }

  // Show create store form only if no store exists and no error occurred
  if (!storeData && !error) {
    return <CreateStore setStoreData={setStoreData} />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  // Show dashboard if store exists
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <DashboardStats />
    </div>
  );
}

// Create Store Component
function CreateStore({
  setStoreData,
}: {
  setStoreData: (data: StoreData) => void;
}) {
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    category: "FASHION",
    contactInfo: {
      email: "",
      phone: "",
      whatsapp: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setStatus("error");
        return;
      }

      // First check if user already has a store
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/my-store`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.success) {
        // User already has a store, use that data
        setStoreData(checkData.data);
        return;
      }

      // If no existing store, create new one
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Store creation response:", data);

      if (response.ok && data.success) {
        setStoreData(data.data);
      } else {
        setError(data.message || "Failed to create store");
        setStatus("error");
      }
    } catch (err) {
      console.error("Store creation error:", err);
      setStatus("error");
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-dark-secondary rounded-lg p-8 border border-dark/10">
        <h1 className="text-2xl font-bold text-white mb-6">
          Create Your Store
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Store Details</h3>

            <input
              type="text"
              placeholder="Store Name"
              value={formData.storeName}
              onChange={(e) =>
                setFormData({ ...formData, storeName: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              required
            />

            <textarea
              placeholder="Store Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                focus:ring-gold-primary focus:border-transparent"
              rows={4}
              required
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-gold-primary 
                focus:border-transparent"
            >
              <option value="FASHION">Fashion</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="FOOD">Food</option>
              <option value="HEALTH">Health & Beauty</option>
              <option value="HOME">Home & Garden</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.contactInfo.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: {
                      ...formData.contactInfo,
                      email: e.target.value,
                    },
                  })
                }
                className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: {
                      ...formData.contactInfo,
                      phone: e.target.value,
                    },
                  })
                }
                className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Store Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                    text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-gold-primary focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                    text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-gold-primary focus:border-transparent"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      postalCode: e.target.value,
                    },
                  })
                }
                className="px-4 py-3 bg-dark-primary border border-white/10 rounded-lg
                  text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-gold-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3 bg-gradient-to-r from-gold-primary to-gold-secondary
              text-dark-primary font-medium rounded-lg hover:shadow-lg 
              hover:shadow-gold-primary/20 transition-all duration-300"
          >
            {status === "loading" ? "Creating Store..." : "Create Store"}
          </button>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </motion.div>
  );
}

// Helper Components
const MetricCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}) => (
  <div className="bg-dark-secondary rounded-lg p-6 border border-white/10">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gold-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-gold-primary" />
      </div>
      <div>
        <p className="text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

// Icon Components
const OrderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8V21H3V8" />
    <path d="M1 3H23V8H1V3Z" />
    <path d="M10 12H14" />
  </svg>
);

const ProductIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" />
    <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" />
    <path d="M12 22.08V12" />
  </svg>
);

const RevenueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1V23" />
    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" />
  </svg>
);
