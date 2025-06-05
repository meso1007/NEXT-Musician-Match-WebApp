"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {isSidebarOpen && (
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      )}
      <main
        className={`transition-all duration-300 relative ${
          isSidebarOpen ? "ml-70" : "ml-0"
        } w-full h-screen `}
      >
        {/* 再表示ボタン（必要であれば） */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className=" absolute z-20 top-5 left-6 px-4 py-2 bg-lime-500 text-white rounded shadow cursor-pointer hover:bg-lime-600"
          >
            Open Menu
          </button>
        )}
        {children}
      </main>
    </div>
  );
}

