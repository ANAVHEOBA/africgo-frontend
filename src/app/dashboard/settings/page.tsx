"use client";

import Link from 'next/link';
import { 
  MapPinIcon, 
  BuildingStorefrontIcon, 
  BellIcon, 
  LockClosedIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const settingsCategories = [
  {
    title: 'Address Management',
    description: 'Manage your store locations and shipping addresses',
    icon: MapPinIcon,
    href: '/dashboard/settings/address',
  },
  {
    title: 'Store Information',
    description: 'Update your store details and business information',
    icon: BuildingStorefrontIcon,
    href: '/dashboard/settings/store',
  },
  {
    title: 'Notifications',
    description: 'Configure your notification preferences',
    icon: BellIcon,
    href: '/dashboard/settings/notifications',
  },
  {
    title: 'Security',
    description: 'Manage your security settings and password',
    icon: LockClosedIcon,
    href: '/dashboard/settings/security',
  },
  {
    title: 'Payment Settings',
    description: 'Configure your payment methods and payout details',
    icon: CreditCardIcon,
    href: '/dashboard/settings/payment',
  },
];

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold-900">Settings</h1>
        <p className="mt-2 text-gold-600">Manage your store preferences and configurations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group block bg-gradient-to-br from-white to-gold-50 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gold-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-gold-100 to-gold-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="w-6 h-6 text-gold-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gold-900 group-hover:text-gold-700 transition-colors">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm text-gold-600">{category.description}</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-gold-600 to-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        ))}
      </div>
    </div>
  );
} 