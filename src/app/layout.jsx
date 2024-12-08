"use client"; // This tells Next.js that this is a Client Component

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-white dark:bg-zinc-800`}>
        {children}
      </body>
    </html>
  );
}
