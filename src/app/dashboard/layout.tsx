"use client";

import { useEffect, useState, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
import { tokenStorage } from '@/lib/auth/tokenStorage';

const DashboardLayout = memo(function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check both token and userType
    const token = tokenStorage.getToken();
    const userType = tokenStorage.getUserType();

    if (!token || userType !== 'merchant') {
      router.replace("/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPath={pathname} />
      <div className="flex-1">
        <TopNav />
        <main className="p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;
