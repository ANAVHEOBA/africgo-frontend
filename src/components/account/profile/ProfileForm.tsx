"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile, updateProfile } from "@/lib/consumers/api"
import { ConsumerProfile, UpdateProfileData } from "@/lib/consumers/types"

export default function ProfileForm() {
  const router = useRouter()
  const [profile, setProfile] = useState<ConsumerProfile | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    const formData = new FormData(e.currentTarget)
    const updateData: UpdateProfileData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    }

    try {
      const updatedProfile = await updateProfile(updateData)
      setProfile(updatedProfile)
      setStatus("success")
      setMessage("Profile updated successfully")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                defaultValue={profile.firstName}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                defaultValue={profile.lastName}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profile.phone}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                text-gray-900/70 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full px-6 py-3 rounded-lg font-medium
              ${status === "loading"
                ? "bg-gold-primary/50 cursor-not-allowed"
                : "bg-gold-primary hover:bg-gold-secondary"
              } text-white transition-colors`}
          >
            {status === "loading" ? "Updating..." : "Update Profile"}
          </button>

          {/* Status Message */}
          {message && (
            <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  )
} 