"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ConsumerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function AccountOverview() {
  const [profile, setProfile] = useState<ConsumerProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        const data = await response.json()
        if (data.success) {
          setProfile(data.data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-secondary p-6 rounded-lg border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          <Link
            href="/account/profile"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Edit Profile →
          </Link>
        </div>
        
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
            <div>
              <p className="text-sm">Name</p>
              <p className="text-white">{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p className="text-sm">Email</p>
              <p className="text-white">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm">Phone</p>
              <p className="text-white">{profile.phone || 'Not set'}</p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Recent Orders */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            View All Orders →
          </Link>
        </div>

        {/* Saved Addresses */}
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Shipping Addresses</h2>
          <Link
            href="/account/addresses"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Manage Addresses →
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 