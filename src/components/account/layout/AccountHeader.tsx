// "use client";

// import { useRouter } from "next/navigation";
// import Logo from "@/components/ui/logo";

// export default function AccountHeader() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userType");
//     router.replace("/login");
//   };

//   return (
//     <header className="bg-white border-b border-gray-200">
//       <div className="px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Logo />
//           <span className="text-gray-900 font-medium">Account Dashboard</span>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => router.push("/account/stores")}
//             className="text-gray-600 hover:text-gold-primary transition-colors"
//           >
//             Browse Stores
//           </button>
//           <button
//             onClick={handleLogout}
//             className="text-gray-600 hover:text-gold-primary transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/ui/logo";

export default function AccountHeader({
  toggleNav,
}: {
  toggleNav: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    router.replace("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left: Hamburger Menu & Logo */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <button onClick={toggleNav} className="p-2 focus:outline-none">
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </button>
          <span className="text-gray-900 font-medium">Account Dashboard</span>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gold-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
