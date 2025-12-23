"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Film, 
  PlayCircle, 
  Users, 
  CreditCard, 
  Package, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
  BarChart3,
  DollarSign,
  MessageSquare
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/uzkadubbing/admin", label: "Dashboard", icon: Home, color: "text-blue-400" },
    { href: "/uzkadubbing/admin/anime", label: "Anime", icon: Film, color: "text-purple-400" },
    { href: "/uzkadubbing/admin/episode", label: "Episodlar", icon: PlayCircle, color: "text-green-400" },
    { href: "/uzkadubbing/admin/reklama", label: "Reklamalar", icon: Bell, color: "text-yellow-400" },
    { href: "/uzkadubbing/admin/users", label: "Foydalanuvchilar", icon: Users, color: "text-pink-400" },
    { href: "/uzkadubbing/admin/subscription-plans", label: "Obuna Rejalari", icon: CreditCard, color: "text-cyan-400" },
    { href: "/uzkadubbing/admin/user-subscription", label: "Foydalanuvchi Obunalari", icon: Package, color: "text-orange-400" },
    { href: "/uzkadubbing/admin", label: "TODO List", icon: BarChart3, color: "text-red-400" },
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close sidebar on mobile when clicking outside
  useEffect(() => {
    if (isOpen && isMobile) {
      const handleClickOutside = (e: MouseEvent) => {
        const sidebar = document.querySelector('aside');
        const hamburger = document.querySelector('[data-hamburger]');
        
        if (sidebar && !sidebar.contains(e.target as Node) && 
            hamburger && !hamburger.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobile]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header - ALWAYS VISIBLE ON TOP */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <button
              data-hamburger
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Menuni yopish" : "Menuni ochish"}
            >
              {isOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-lg">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">UzKaDubbing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-700/50 rounded-lg relative">
              <Bell className="text-gray-300" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50
          md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-64
          fixed top-0 left-0 h-screen w-64 z-40
          transition-transform duration-300 ease-in-out
          shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Desktop Header */}
        <div className="p-6 border-b border-gray-700/50 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-gray-400">UzKaDubbing</p>
            </div>
          </div>
        </div>

        {/* User Info - Desktop */}
        <div className="p-4 border-b border-gray-700/50 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@uzkadubbing.uz</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || 
                (link.href !== "/uzkadubbing/admin" && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-l-4 border-purple-500" 
                      : "hover:bg-gray-700/50"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-500/20' : 'bg-gray-700/30'}`}>
                    <Icon className={isActive ? "text-purple-400" : link.color} size={18} />
                  </div>
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-700/50" />

          {/* Additional Links */}
          <div className="space-y-1">
            <Link
              href="/uzkadubbing/admin"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 rounded-lg bg-gray-700/30">
                <Settings className="text-gray-400" size={18} />
              </div>
              <span className="text-gray-300 font-medium">Sozlamalar</span>
            </Link>

            <Link
              href="/uzkadubbing/admin"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 rounded-lg bg-gray-700/30">
                <HelpCircle className="text-gray-400" size={18} />
              </div>
              <span className="text-gray-300 font-medium">Yordam</span>
            </Link>

            <Link
              href="/uzkadubbing/admin"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 rounded-lg bg-gray-700/30">
                <BarChart3 className="text-gray-400" size={18} />
              </div>
              <span className="text-gray-300 font-medium">Analitika</span>
            </Link>
          </div>
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 w-full transition-colors"
            onClick={() => {
              // Logout logic here
              alert("Chiqish qilish");
            }}
          >
            <div className="p-2 rounded-lg bg-red-500/20">
              <LogOut size={18} />
            </div>
            <span className="font-medium">Chiqish</span>
          </button>
          
          {/* Version info - Desktop only */}
          <div className="hidden md:block mt-4 text-center">
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Add padding for mobile header */}
      <style jsx>{`
        @media (max-width: 768px) {
          :global(main) {
            padding-top: 4rem !important;
          }
        }
      `}</style>
    </>
  );
}