import Link from 'next/link';
import { LayoutDashboard, Users, Globe, BookOpen, Settings, LogOut, PlusCircle } from 'lucide-react';

const navItems = [
  { name: 'All Stories', href: '/', icon: LayoutDashboard },
  { name: 'Public Stories', href: '/public', icon: Globe },
  { name: 'Family & Heritage', href: '/heritage', icon: Users },
  { name: 'Add stories', href: '/stories/new', icon: PlusCircle },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Challenger Stories
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
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
  );
}