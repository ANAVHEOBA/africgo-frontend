"use client";

import { useState, useEffect } from "react";
import { getAddresses } from "@/lib/stores/api";
import { Address } from "@/lib/stores/types";
import AddressForm from "@/components/dashboard/settings/AddressForm";
import { toast } from "react-hot-toast";
import { PlusIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedAddress(null);
    fetchAddresses(); // Refresh the list after form closes
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <MapPinIcon className="w-8 h-8 text-gold-600" />
          <h1 className="text-3xl font-bold text-gold-900">
            Address Management
          </h1>
        </div>
        <p className="text-gold-600 ml-11">
          Manage your shipping and billing addresses
        </p>
      </div>

      <div className="flex justify-end mb-8">
        <button
          onClick={handleAddNew}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-dark rounded-lg hover:from-gold-700 hover:to-gold-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Address
        </button>
      </div>

      {showForm && (
        <AddressForm
          existingAddress={selectedAddress}
          onClose={handleFormClose}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address._id}
            onClick={() => handleEdit(address)}
            className="group bg-gradient-to-br from-white to-gold-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gold-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gold-900 group-hover:text-gold-700 transition-colors">
                    {address.label}
                  </h3>
                  {address.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 px-3 py-1 rounded-full font-medium border border-gold-200">
                      Default Address
                    </span>
                  )}
                </div>
                <div className="p-2 bg-gold-50 rounded-lg group-hover:bg-gold-100 transition-colors">
                  <MapPinIcon className="w-5 h-5 text-gold-600" />
                </div>
              </div>
              <div className="space-y-1 text-sm text-gold-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>
                  {address.country}, {address.postalCode}
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-gold-600 to-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        ))}
      </div>
    </div>
  );
}
