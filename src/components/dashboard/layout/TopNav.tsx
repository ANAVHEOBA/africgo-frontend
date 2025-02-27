"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TopNav() {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="bg-dark-secondary border-b border-white/10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <span className="text-xl font-bold text-white">Store Name</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-gold-primary/20 flex items-center justify-center">
              <span className="text-gold-primary font-medium">JD</span>
            </div>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-primary border border-white/10 rounded-lg shadow-lg py-1">
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-white/5"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 