import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Home, Plus, User, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-72 bg-gradient-to-b from-slate-50 to-white border-r-2 border-slate-100 shadow-lg flex-col h-screen sticky top-0">
        <div className="p-8 border-b-2 border-slate-100">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-300 rounded-full flex items-center justify-center shadow-md mb-4">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h2 className="text-3xl font-light text-slate-700">BUNYAD</h2>
          <p className="text-sm text-slate-500 mt-3 font-light">Welcome, <span className="font-medium text-slate-700">{user?.name}</span>!</p>
        </div>

        <nav className="p-8 space-y-3 flex-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-4 px-6 py-4 rounded-full bg-white hover:bg-green-50 hover:shadow-md transition-all text-slate-700 font-light border-2 border-slate-100 hover:border-green-300"
          >
            <Home size={22} className="text-green-400 flex-shrink-0" />
            <span className="text-base">My Listings</span>
          </Link>
          <Link
            to="/dashboard/add-property"
            className="flex items-center gap-4 px-6 py-4 rounded-full bg-white hover:bg-green-50 hover:shadow-md transition-all text-slate-700 font-light border-2 border-slate-100 hover:border-green-300"
          >
            <Plus size={22} className="text-green-400 flex-shrink-0" />
            <span className="text-base">Add Property</span>
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-4 px-6 py-4 rounded-full bg-white hover:bg-green-50 hover:shadow-md transition-all text-slate-700 font-light border-2 border-slate-100 hover:border-green-300"
          >
            <User size={22} className="text-green-400 flex-shrink-0" />
            <span className="text-base">Profile</span>
          </Link>
        </nav>

        <div className="p-8 border-t-2 border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-400 to-green-300 hover:from-green-500 hover:to-green-400 text-white rounded-full font-light shadow-md hover:shadow-lg transition-all"
          >
            <LogOut size={20} />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-4 md:py-8 px-4 md:px-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
