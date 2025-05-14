import Link from "next/link";
import {
  Home,
  MessageCircle,
  Timer,
  Cog as GearIcon,
  Bell as BellSimpleIcon,
  Clipboard as ClipboardTextIcon,
} from "lucide-react";

type DashboardSidebarProps = {
  userType: "seeker" | "realtor";
};

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const navItems = [
    // { name: "Saved Properties", icon: Home, href: "/dashboard/saved" },
    {
      name: "Messages",
      icon: MessageCircle,
      href: "/messages",
    },
    { name: "Scheduled Visits", icon: Timer, href: "/dashboard/visits" },
    // { name: "Profile Settings", icon: GearIcon, href: "/dashboard/settings" },
    // {
    //   name: "Notifications",
    //   icon: BellSimpleIcon,
    //   href: "/dashboard/notifications",
    // },
  ];

  if (userType === "realtor") {
    navItems.push({
      name: "Listings Management",
      icon: ClipboardTextIcon,
      href: "/realtor/listings",
    });
  }

  return (
    <aside className="w-64 bg-[#2C3E50] text-white p-6">
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-2 hover:bg-[#34495E] p-2 rounded"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
