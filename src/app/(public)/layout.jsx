"use client"; // This tells Next.js that this is a Client Component

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import Navbar from "@/components/nav";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ViewTransitions } from 'next-view-transitions'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ViewTransitions>
      <div className={inter.className}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <div className="relative">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <header>
              <div className="w-full">
                <nav className="w-full">
                  <div className="max-w-5xl mx-auto px-2 md:px-6 xl:px-4">
                    <div className="flex flex-wrap items-center justify-between">
                      {/* Navigation */}
                      <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    </div>
                  </div>
                </nav>
              </div>
            </header>
            <main className="max-w-12xxl mx-auto">{children}</main>
          </div>
          </div>
        </ThemeProvider>
      </div>
    </ViewTransitions>
  );
}