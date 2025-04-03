"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/account" },
  { label: "Profile", href: "/account/profile" },
  { label: "Browse Stores", href: "/account/stores" },
  { label: "Orders", href: "/account/orders" },
  //{ label: "Addresses", href: "/account/addresses" },
  //{ label: "Settings", href: "/account/settings" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="py-6 px-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-gold-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
