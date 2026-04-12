// components/dashboard/Sidebar.tsx
'use client'; // Required for state

import Link from 'next/link';
import { LayoutDashboard, Globe, Users, PlusCircle, Settings, LogOut, X } from 'lucide-react';

const navItems = [
  { name: 'All Stories', href: '/', icon: LayoutDashboard },
  { name: 'Public Stories', href: '/public', icon: Globe },
  { name: 'Family & Heritage', href: '/heritage', icon: Users },
  { name: 'Add stories', href: '/stories/new', icon: PlusCircle },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay - blurred background when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out
        w-64 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        {/* Header with Close Button (Mobile Only) */}
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Challenger
          </h1>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)} // Close on link click (mobile)
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-white">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}