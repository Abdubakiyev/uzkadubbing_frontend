"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/uzkadubbing/admin/anime", label: "🎬 Anime" },
    { href: "/uzkadubbing/admin/episode", label: "▶️ Episodlar" },
    { href: "/uzkadubbing/admin/reklama", label: "🎬 Reklama" },
    { href: "/uzkadubbing/admin/users", label: "👤 Foydalanuvchilar" },
    { href: "/uzkadubbing/admin/subscription-plans", label: "💳 Obunalar (Plans)" },
    { href: "/uzkadubbing/admin/user-subscription", label: "📦 User Subscriptions" },
    { href: "/uzkadubbing/admin", label: "📋 TODO List" },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <button
          className="text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 p-6 border-r border-gray-700 min-h-screen
          md:block fixed md:static top-0 left-0 z-40 w-64
          transition-transform transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="text-2xl font-bold mb-6 hidden md:block">Admin Panel</h1>

        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
              onClick={() => setIsOpen(false)} // mobile-da link bosilganda sidebar yopilsin
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
