"use client"; // This tells Next.js that this is a Client Component

import { Inter } from "next/font/google";
import { useState } from "react";
import Navbar from "@/components/nav";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ViewTransitions } from 'next-view-transitions'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={inter.className}>
            {children}
        </body>
    </html>
  )
}