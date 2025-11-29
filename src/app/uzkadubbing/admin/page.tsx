"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Square, Plus, Play, Users, CreditCard, Film, BarChart3, Calendar, Eye, Crown } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { Anime } from "@/src/features/types/Anime";
import { UserForm } from "@/src/features/types/User";
import { getAllAnime } from "@/src/features/api/Anime";
import { fetchUsers } from "@/src/features/api/Users";


export default function AdminDashboard() {
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Yangi anime qo'shish", done: false },
    { id: 2, text: "Episod yuklash", done: true },
    { id: 3, text: "Foydalanuvchilarni tekshirish", done: false },
  ]);

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ================= TODO FUNCTIONS =================
  const addTask = () => {
    if (!todo.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: todo, done: false }]);
    setTodo("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [animeData, userData] = await Promise.all([getAllAnime(), fetchUsers()]);
      setAnimeList(animeData);
      setUsers(userData);
    } catch (err) {
      console.error("Data fetch xatosi:", err);
    } finally {
      setLoadingAnime(false);
      setLoadingUsers(false);
    }
  };

  // ================= STATS =================
  const stats = [
    { title: "Jami Anime", value: animeList.length, icon: Film, color: "bg-blue-500" },
    { title: "Jami Foydalanuvchilar", value: users.length, icon: Users, color: "bg-green-500" },
    { title: "Obuna Bo'lganlar", value: users.filter(u => u.isSubscribed).length, icon: Crown, color: "bg-purple-500" },
    { title: "Bugun Ko'rilgan", value: "1.2K", icon: Eye, color: "bg-orange-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar/>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Sizning AnimeLab platformangizning statistik ma'lumotlari</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.color.replace('bg-', 'bg-gradient-to-r from-')} to-${stat.color.split('-')[1]}-300`} 
                  style={{ width: `${Math.min(100, ((stat.value as number)/ 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ================= TODO LIST ================= */}
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 size={24} className="text-purple-400" />
                Vazifalar Ro'yxati
              </h2>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                {tasks.filter(t => !t.done).length} qoldi
              </span>
            </div>

            <div className="flex gap-2 mb-5">
              <input
                className="flex-1 px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                placeholder="Yangi vazifa qo'shish..."
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                onClick={addTask}
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
              >
                <Plus size={18} /> Qo'shish
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`p-1 rounded ${task.done ? 'text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                    >
                      {task.done ? (
                        <CheckSquare size={22} className="bg-green-500/20 p-1 rounded" />
                      ) : (
                        <Square size={22} />
                      )}
                    </button>

                    <span className={task.done ? "line-through text-gray-500" : "text-gray-200"}>
                      {task.text}
                    </span>
                  </div>
                  
                  {task.done && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      Bajarildi
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= ANIME LIST ================= */}
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Film size={24} className="text-blue-400" />
                So'ngi Anime
              </h2>
              <Link 
                href="/admin/anime" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Barchasini ko'rish →
              </Link>
            </div>
            
            {loadingAnime ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : animeList.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Film size={48} className="mx-auto mb-3 opacity-50" />
                <p>Hozircha anime mavjud emas.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {animeList.slice(0, 5).map((anime) => (
                  <div key={anime.id} className="flex gap-4 bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{anime.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{anime.views}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${anime.isPaid ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-600/50 text-gray-400'}`}>
                          {anime.isPaid ? "Pullik" : "Bepul"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{new Date(anime.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= USERS LIST ================= */}
        <div className="mt-8 bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={24} className="text-green-400" />
              So'ngi Foydalanuvchilar
            </h2>
            <Link 
              href="/admin/users" 
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Barchasini ko'rish →
            </Link>
          </div>
          
          {loadingUsers ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>Hozircha foydalanuvchilar mavjud emas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.slice(0, 6).map((user) => (
                <div key={user.id} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                      alt={user.username || user.email}
                      className="w-12 h-12 rounded-full border-2 border-gray-600 bg-gray-700 object-cover"
                    />
                    {user.isSubscribed && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-1 shadow-lg">
                        <Crown size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{user.username || "Foydalanuvchi"}</h3>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'}`}>
                        {user.isSubscribed ? "Obuna bo'lgan" : "Obuna bo'lmagan"}
                      </span>
                      {user.role === 'ADMIN' && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}