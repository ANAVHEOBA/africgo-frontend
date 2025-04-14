'use client';

import { useState, useRef } from 'react';
import { Store, StoreImage, UpdateStoreData } from '@/lib/stores/types';
import { uploadStoreImage, updateStore } from '@/lib/stores/api';
import { CameraIcon } from '@heroicons/react/24/outline';

interface StoreInformationProps {
  store: Store;
  onUpdate: (updatedStore: Store) => void;
}

export default function StoreInformation({ store, onUpdate }: StoreInformationProps) {
  const [image, setImage] = useState<StoreImage | null>(store.logo ? { url: store.logo, publicId: '' } : null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const response = await uploadStoreImage(file);
      setImage(response.data.image);
      
      // The store is already updated by the upload endpoint
      onUpdate({
        ...store,
        logo: response.data.image.url
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Store Logo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a logo for your store. This will be displayed on your store page and in search results.
        </p>
      </div>

      <div
        className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
          uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-900/50'
        }`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          {image ? (
            <div className="relative">
              <img
                src={image.url}
                alt="Store logo"
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
              {!uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <CameraIcon className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CameraIcon className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-500">
          Uploading image...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
} 