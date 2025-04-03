"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store } from "@/lib/stores/types";
import { getStores } from "@/lib/stores/api";
import StoreCard from "@/components/stores/listing/StoreCard";

export default function AccountStoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data.stores || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError("Failed to load stores");
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">Browse Stores</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stores.map((store) => (
          <StoreCard
            key={store._id}
            store={store}
          />
        ))}
      </motion.div>
    </div>
  );
}