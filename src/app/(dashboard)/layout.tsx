// app/dashboard/layout.tsx (or wherever your dashboard layout is)
'use client';

import { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-30">
        <h1 className="text-xl font-bold">Challenger</h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-md"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      {/* Note: ml-0 on mobile, lg:ml-64 on desktop */}
      <main className="lg:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}