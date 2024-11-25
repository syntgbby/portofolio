"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ThemeSwitcher } from "../theme-switcher";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation"; // Correctly call useRouter
import Link from "next/link"; // Correct import for Link

interface NavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Navbar({ isOpen, toggleSidebar }: NavProps) {
  const router = useRouter(); // Correctly call useRouter
  const path = usePathname();

  // Handle logout functionality
  const onLogOut = async () => {
    try {
      const res = await fetch(`/api/auth/logout`, {
        method: "POST",
      });

      if (res.ok) {
        // Successfully logged out, redirect to home
        router.push("/", { scroll: false });
      } else {
        const response = await res.json();
        console.error("Logout error:", response.message);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  // Navigation links and their respective actions
  const links = [
    {
      path: "/admin",
      text: "List Messages",
    },
    {
      path: "/admin/message",
      text: "Message",
    },
    {
      path: "/admin/work",
      text: "Work",
    },
    {
      path: "/admin/blogs",
      text: "Blogs",
    },
    {
      path: "#", // Placeholder path for logout
      text: "Log Out",
      onClick: onLogOut, // Assign the logout function
    },
  ];

  return (
    <div className="fixed left-0 top-5 z-50 w-full">
      <nav className="flex items-center justify-between text-text border-border dark:border-darkBorder shadow-light dark:shadow-dark mx-auto w-max gap-5 rounded-base border-2 bg-rose-200 p-2.5 px-5 text-sm font-base sm:text-base w450:gap-4">
        {/* Mobile menu toggle */}
        <div className="justify-self-end mr-4 hover:cursor-pointer lg:hidden">
          <Menu onClick={toggleSidebar} size={20} />
        </div>

        {/* Logo */}
        <div className="text-white font-bold text-lg">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="justify-center"
            />
          </Link>
        </div>

        {/* Navigation links */}
        <div className="lg:flex hidden gap-4 items-center">
          {links.map((link) => (
            <div key={link.path} className="relative">
              {link.onClick ? (
                <button
                  onClick={link.onClick}
                  className={clsx(
                    "hover:border-border dark:hover:border-darkBorder rounded-base border-2 px-2 py-1 transition-colors",
                    path === link.path
                      ? "border-border dark:border-darkBorder"
                      : "border-transparent"
                  )}
                >
                  {link.text}
                </button>
              ) : (
                <Link
                  href={link.path}
                  className={clsx(
                    "hover:border-border dark:hover:border-darkBorder rounded-base border-2 px-2 py-1 transition-colors",
                    path === link.path
                      ? "border-border dark:border-darkBorder"
                      : "border-transparent"
                  )}
                >
                  {link.text}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Theme switcher */}
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
