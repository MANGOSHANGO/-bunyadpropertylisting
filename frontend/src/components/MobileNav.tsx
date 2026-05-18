import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function MobileNav() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (!isDashboard && !isAuthenticated) return null;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t-2 border-slate-100 shadow-lg">
      <div className="flex justify-around items-center h-20">
        {isDashboard ? (
          <>
            <Link
              to="/dashboard"
              className={lex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all }
            >
              <Home size={24} />
              <span className="text-xs font-light">Listings</span>
            </Link>

            <Link
              to="/dashboard/add-property"
              className={lex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all }
            >
              <Plus size={24} />
              <span className="text-xs font-light">Add</span>
            </Link>

            <Link
              to="/dashboard/profile"
              className={lex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all }
            >
              <User size={24} />
              <span className="text-xs font-light">Profile</span>
            </Link>

            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="flex flex-col items-center gap-1 py-3 px-4 text-red-500 rounded-lg transition-all"
            >
              <LogOut size={24} />
              <span className="text-xs font-light">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className={lex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all }
            >
              <Home size={24} />
              <span className="text-xs font-light">Home</span>
            </Link>

            <Link
              to="/search"
              className={lex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all }
            >
              <Search size={24} />
              <span className="text-xs font-light">Search</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
