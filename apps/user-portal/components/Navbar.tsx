"use client";

import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="bg-blue-400 px-4 py-2  shadow-md  flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Coupon User</h1>
    </nav>
  );
};
