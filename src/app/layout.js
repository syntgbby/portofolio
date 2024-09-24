"use client"; // This tells Next.js that this is a Client Component

import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { useState } from "react"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="py-2" style={{ backgroundColor: '#f7d2d3' }}>
          <nav className="w-full">
            <div className="max-w-5xl mx-auto px-2 md:px-6 xl:px-4">
              <div className="flex flex-wrap items-center justify-between">
                {/* Logo in the center */}
                <div className="text-white font-bold text-lg">
                  <a href="/">
                    <Image src="/logo.jpg" alt="Logo" width={160} height={160} className="justify-center" />
                  </a>
                </div>

                {/* Mobile menu button with animation */}
                <div className="block md:hidden">
                  <button
                    className="text-rose-800 transition-transform duration-500 transform hover:scale-125 active:scale-100" 
                    onClick={toggleMenu}
                  >
                    ☰
                  </button>
                </div>

                {/* Navigation items on the right */}
                <div className={`md:flex flex-row gap-10 ${isMenuOpen ? 'block' : 'hidden'} ml-auto`}>
                  <ul className="flex flex-col md:flex-row gap-3 text-rose-600 font-semibold">
                    <li>
                      <a href="/about" className="hover:text-rose-800 transition-colors duration-500">About</a>
                    </li>
                    <li>
                      <a href="/work" className="hover:text-rose-800 transition-colors duration-500">Work</a>
                    </li>
                    <li>
                      <a href="/contact" className="hover:text-rose-800 transition-colors duration-500">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-12xxl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
