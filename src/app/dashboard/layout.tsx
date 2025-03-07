"use client";

import { useEffect, useState, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";

const DashboardLayout = memo(function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsLoading(false);
  }, [router]); // Remove pathname dependency

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath={pathname} />
      <div className="flex-1">
        <TopNav />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;
