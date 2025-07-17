// dashboard/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { FiHome, FiLink2, FiSettings } from "react-icons/fi";

const navItems = [
  { label: "Home", href: "/dashboard", icon: <FiHome /> },
  { label: "Links", href: "/dashboard/links", icon: <FiLink2 /> },
  { label: "Settings", href: "/dashboard/settings", icon: <FiSettings /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-2">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition 
              ${
                activeTab === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
}
