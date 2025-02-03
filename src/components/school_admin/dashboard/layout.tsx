/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { signingOut } from "@/firebase/onboarding";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Settings,
  Power,
  BarChart2,
  Users,
  LucideIcon,
  UserCheck,
  Menu,
  X,
  CircleX,
  BookOpenCheck,
} from "lucide-react";

import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { setModal } from "@/store/slices/modal";
import { useDispatch } from "react-redux";

interface NavButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    className={`p-2 hover:bg-gray-50 rounded-lg ${className}`}
  >
    <Icon size={20} />
  </button>
);

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  route: string;
  // onClick?:()=> void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon: Icon,
  label,
  route,
  // onClick,
}) => {
  const path = usePathname();
  const { push } = useRouter();

  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 hover:opacity-80 ${
        path === route ? "bg-secondary -ml-4 text-orange-300" : "text-gray-600"
      }`}
      onClick={() => push(route)}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};

const sidebarItems = [
  {
    icon: BarChart2,
    label: "Dashboard",
    route: "/school_admin/dashboard",
  },
  {
    icon: UserCheck,
    label: "Teachers",
    route: "/school_admin/teachers",
  },
  {
    icon: Users,
    label: "Students",
    route: "/school_admin/students",
  },
  {
    icon: BookOpenCheck,
    label: "Results",
    route: "/school_admin/results",
  },
];

const SchoolAdminLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    const { push } = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const dispatch = useDispatch()
    const handleLogOut = useCallback(async () => {
      await signingOut();
      push("/admin/onboarding/signin");
    }, [push]);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
      dispatch(setModal({ open: false, type: "" }));
    }, [])
    return (
      <div className="min-h-screen md:h-screen bg-gray-50 overflow-y-hidden">
        {/* Navbar */}
        <nav className="bg-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src="/aks_logo2.webp"
                  alt="AKS Schools Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden lg:flex text-sm font-semibold text-primary font-geistSans">
                School Admin Portal
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Start searching here..."
                className="w-64 px-4 py-2 rounded-lg bg-gray-50 focus:outline-none"
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <NavButton icon={Settings} />
            <NavButton
              icon={Power}
              onClick={handleLogOut}
              className="text-red-500"
            />
            <NavButton
              icon={isSidebarOpen ? X : Menu}
              onClick={toggleSidebar}
              className="md:hidden"
            />
          </div>
        </nav>
        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white h-screen p-4 hidden md:block">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <SidebarButton
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  route={item.route}
                />
              ))}
            </div>
          </aside>
          {/* Modal Sidebar */}
          <Dialog
            open={isSidebarOpen}
            onClose={toggleSidebar}
            className="relative z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black/30" />
            <Dialog.Panel className="fixed inset-0 z-50 flex items-start justify-end">
              <div className="bg-white w-64">
                <CircleX
                  className="cursor-pointer text-red-500 m-4"
                  onClick={toggleSidebar}
                />
                <div className="space-y-2 p-4 h-screen">
                  {sidebarItems.map((item) => (
                    <SidebarButton
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      route={item.route}
                    />
                  ))}
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>

          {/* Main Content */}
          <div className="md:overflow-y-hidden md:h-[calc(100vh-100px)]">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

SchoolAdminLayout.displayName = "SchoolAdminLayout";
export { SchoolAdminLayout };
