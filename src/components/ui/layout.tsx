import React, { useState } from "react";
import Sidebar from "../sidebar";
import Navbar from "../nav";

function Layout({ children }: { children: React.ReactNode }) { // Ubah 'layout' menjadi 'Layout'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main>{children}</main>
    </div>
  );
}

export default Layout; // Ubah 'layout' menjadi 'Layout'
