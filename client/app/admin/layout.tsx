import type React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Bell,
  BarChart2,
  Shield,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { name: "Properties", icon: Home, href: "/admin/properties" },
    { name: "Users", icon: Users, href: "/admin/users" },
    // { name: "Transactions", icon: DollarSign, href: "/admin/transactions" },
    // { name: "Roles & Access", icon: Shield, href: "/admin/roles" },
    // { name: "Notifications", icon: Bell, href: "/notifications" },
    // { name: "Reports", icon: BarChart2, href: "/admin/reports" },
    // { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Link
            href="/admin/logout"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
