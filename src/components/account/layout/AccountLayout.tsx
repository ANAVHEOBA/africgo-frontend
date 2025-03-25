// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AccountNav from "./AccountNav";
// import AccountHeader from "./AccountHeader";

// export default function AccountLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   // Check if user is logged in and is a consumer
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userType = localStorage.getItem("userType");

//     if (!token || userType !== "consumer") {
//       router.replace("/login");
//     }
//   }, [router]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <AccountHeader />
//       <div className="flex-1 flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
//           <AccountNav />
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountNav from "./AccountNav";
import AccountHeader from "./AccountHeader";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(true); // Sidebar open by default on large screens

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "consumer") {
      router.replace("/login");
    }
  }, [router]);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <AccountHeader toggleNav={toggleNav} />

      <div className="flex flex-1">
        {/* Sidebar - Now Togglable on Both Mobile & Desktop */}
        <aside
          className={`w-64 bg-white border-r border-gray-200 fixed left-0 top-[64px] inset-y-0 transform transition-transform duration-300 ease-in-out
    ${isNavOpen ? "translate-x-0" : "-translate-x-64"}`}
        >
          <AccountNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
