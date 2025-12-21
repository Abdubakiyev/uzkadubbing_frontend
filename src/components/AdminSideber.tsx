"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-6 border-r border-gray-700 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <nav className="flex flex-col gap-3">
        <Link
          href="/uzkadubbing/admin/anime"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          🎬 Anime
        </Link>

        <Link
          href="/uzkadubbing/admin/episode"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          ▶️ Episodlar
        </Link>

        <Link
          href="/uzkadubbing/admin/reklama"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          🎬 Reklama
        </Link>

        <Link
          href="/uzkadubbing/admin/users"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          👤 Foydalanuvchilar
        </Link>

        <Link
          href="/uzkadubbing/admin/subscription-plans"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          💳 Obunalar (Plans)
        </Link>

        <Link
          href="/uzkadubbing/admin/user-subscription"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          📦 User Subscriptions
        </Link>

        <Link
          href="/uzkadubbing/admin"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          📋 TODO List
        </Link>
      </nav>
    </aside>
  );
}
