"use client";

import { Link } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { ThemeSwitcher } from "../theme-switcher";
import Image from "next/image";
import { Menu } from "lucide-react";

interface NavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Navbar({ isOpen, toggleSidebar }: NavProps) {
  const path = usePathname();
  const router = useRouter();

  const Login = () => {
    router.push("/login");
  };
  const Register = () => {
    router.push("/register");
  };
  const Blogs = () => {
    router.push("/blogs");
  };
  const links = [
    {
      path: "/login",
      text: "Login",
      onClick: Login,
    },
    {
      path: "/register",
      text: "Register",
      onClick: Register,
    },
  ];

  return (
    <div className="fixed left-0 top-5 z-50 w-full">
      <nav className="flex items-center text-text border-border dark:border-darkBorder shadow-light dark:shadow-dark mx-auto w-max gap-5 rounded-base border-2 bg-rose-200 p-2.5 px-5 text-sm font-base sm:text-base w450:gap-4">
        <div className="justify-self-end mr-4 hover:cursor-pointer lg:hidden">
          <Menu onClick={toggleSidebar} size={20} />
        </div>
        <div className="text-white font-bold text-lg">
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="justify-center"
            />
          </a>
        </div>

        {links.map((link) => {
          return (
            <div key={link.path} className="lg:block hidden">
              {" "}
              <button
                className={clsx(
                  "hover:border-border dark:hover:border-darkBorder rounded-base border-2 px-2 py-1 transition-colors",
                  path === link.path
                    ? "border-border dark:border-darkBorder"
                    : "border-transparent"
                )}
                onClick={link.onClick}
              >
                {link.text}
              </button>
            </div>
          );
        })}
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
