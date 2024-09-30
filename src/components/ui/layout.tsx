import React, { useState } from "react";
import Sidebar from "../sidebar";
import Navbar from "../nav";
function layout({ children }: { children: React.ReactNode }) {
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

export default layout;
