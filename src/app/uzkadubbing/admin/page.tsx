"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Play, 
  Users, 
  CreditCard, 
  Film, 
  BarChart3, 
  Calendar, 
  Eye, 
  Crown,
  Zap,
  TrendingUp,
  RefreshCw,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter
} from "lucide-react";
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
    { id: 4, text: "Reklamalar yangilash", done: false },
    { id: 5, text: "Server xatolari tekshirish", done: true },
  ]);

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "todo" | "anime" | "users">("stats");
  const [searchTerm, setSearchTerm] = useState("");

  // ================= TODO FUNCTIONS =================
  const addTask = () => {
    if (!todo.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: todo, done: false }]);
    setTodo("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingAnime(true);
      setLoadingUsers(true);
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

  // ================= FILTERED DATA =================
  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anime.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6);

  // ================= STATS =================
  const stats = [
    { 
      title: "Jami Anime", 
      value: animeList.length, 
      icon: Film, 
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
      trend: "up"
    },
    { 
      title: "Foydalanuvchilar", 
      value: users.length, 
      icon: Users, 
      color: "from-green-500 to-emerald-500",
      change: "+8%",
      trend: "up"
    },
    { 
      title: "Obuna Bo'lgan", 
      value: users.filter(u => u.isSubscribed).length, 
      icon: Crown, 
      color: "from-purple-500 to-pink-500",
      change: "+23%",
      trend: "up"
    },
    { 
      title: "Faol Ko'rishlar", 
      value: "1.2K", 
      icon: Eye, 
      color: "from-orange-500 to-red-500",
      change: "-3%",
      trend: "down"
    },
  ];

  // ================= MOBILE NAVIGATION =================
  const MobileNav = () => (
    <div className="lg:hidden mb-6">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "stats" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          📊 Stats
        </button>
        <button
          onClick={() => setActiveTab("todo")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "todo" 
              ? "bg-blue-600/30 text-blue-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          📝 TODO
        </button>
        <button
          onClick={() => setActiveTab("anime")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "anime" 
              ? "bg-green-600/30 text-green-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          🎬 Anime
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "users" 
              ? "bg-yellow-600/30 text-yellow-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          👥 Users
        </button>
      </div>
    </div>
  );

  // ================= STATS COMPONENT =================
  const StatsSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
            <BarChart3 className="text-purple-400" size={20} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold">Statistikalar</h2>
        </div>
        <button
          onClick={loadData}
          className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
          title="Yangilash"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                stat.trend === "up" 
                  ? "bg-green-500/20 text-green-300" 
                  : "bg-red-500/20 text-red-300"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href="/uzkadubbing/admin/anime"
          className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 p-3 rounded-lg text-sm"
        >
          <Plus size={16} />
          Anime qo'shish
        </Link>
        <Link
          href="/uzkadubbing/admin/users"
          className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 p-3 rounded-lg text-sm"
        >
          <Users size={16} />
          Foydalanuvchi qo'shish
        </Link>
      </div>
    </div>
  );

  // ================= TODO COMPONENT =================
  const TodoSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-2 rounded-lg">
            <CheckSquare className="text-blue-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Vazifalar ro'yxati</h2>
            <p className="text-sm text-gray-400">
              {tasks.filter(t => !t.done).length} ta qoldi
            </p>
          </div>
        </div>
        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm">
          {tasks.length} ta
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Yangi vazifa..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-700 flex items-center gap-1"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Qo'shish</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg border border-gray-600/30 hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 p-1 rounded ${task.done ? 'text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                {task.done ? (
                  <CheckSquare size={18} className="bg-green-500/20 p-0.5 rounded" />
                ) : (
                  <Square size={18} />
                )}
              </button>

              <span className={`truncate ${task.done ? "line-through text-gray-500" : "text-gray-200"}`}>
                {task.text}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {task.done && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full hidden sm:inline">
                  Bajarildi
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-300"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ================= ANIME COMPONENT =================
  const AnimeSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 rounded-lg">
            <Film className="text-green-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">So'nggi animelar</h2>
            <p className="text-sm text-gray-400">
              {filteredAnime.length} ta ko'rsatilmoqda
            </p>
          </div>
        </div>
        <Link 
          href="/uzkadubbing/admin/anime" 
          className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
        >
          Barchasi
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Anime qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
      </div>
      
      {loadingAnime ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-green-400" size={32} />
        </div>
      ) : filteredAnime.length === 0 ? (
        <div className="text-center py-8">
          <Film className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400">
            {searchTerm ? "Qidiruv bo'yicha anime topilmadi" : "Hozircha anime mavjud emas."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-green-400 hover:text-green-300 text-sm mt-2"
            >
              Qidiruvni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAnime.map((anime) => (
            <div key={anime.id} className="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600/30 hover:bg-gray-700/50 transition-all group">
              <div className="relative">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${anime.isPaid ? 'bg-yellow-500/80 text-yellow-100' : 'bg-green-500/80 text-green-100'}`}>
                    {anime.isPaid ? "💰" : "🆓"}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate mb-1">{anime.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{anime.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(anime.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ================= USERS COMPONENT =================
  const UsersSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 rounded-lg">
            <Users className="text-yellow-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">So'nggi foydalanuvchilar</h2>
            <p className="text-sm text-gray-400">
              {filteredUsers.length} ta ko'rsatilmoqda
            </p>
          </div>
        </div>
        <Link 
          href="/uzkadubbing/admin/users" 
          className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
        >
          Barchasi
          <ChevronRight size={16} />
        </Link>
      </div>

      {loadingUsers ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-yellow-400" size={32} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400">
            {searchTerm ? "Qidiruv bo'yicha foydalanuvchi topilmadi" : "Hozircha foydalanuvchilar mavjud emas."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-yellow-400 hover:text-yellow-300 text-sm mt-2"
            >
              Qidiruvni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30 hover:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                    alt={user.username || user.email}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 bg-gray-700 object-cover"
                  />
                  {user.isSubscribed && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-0.5">
                      <Crown size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{user.username || "Foydalanuvchi"}</h3>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${user.isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'}`}>
                      {user.isSubscribed ? "💎" : "—"}
                    </span>
                    {user.role === 'ADMIN' && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">
                        A
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar/>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Sizning platformangizning statistik ma'lumotlari va boshqaruv paneli
            </p>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StatsSection />
              <TodoSection />
            </div>
            <div className="space-y-6">
              <AnimeSection />
              <UsersSection />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {activeTab === "stats" && <StatsSection />}
            {activeTab === "todo" && <TodoSection />}
            {activeTab === "anime" && <AnimeSection />}
            {activeTab === "users" && <UsersSection />}
          </div>

          {/* Quick Stats Bar (Mobile) */}
          <div className="lg:hidden mt-6">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold">{animeList.length}</div>
                  <div className="text-xs text-gray-400">Anime</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{users.length}</div>
                  <div className="text-xs text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{users.filter(u => u.isSubscribed).length}</div>
                  <div className="text-xs text-gray-400">Subscribed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{tasks.filter(t => !t.done).length}</div>
                  <div className="text-xs text-gray-400">Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 