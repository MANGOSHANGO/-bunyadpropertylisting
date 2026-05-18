import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Menu, X, LogOut, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchCity, setSearchCity] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/search?city=${searchCity}&purpose=buy`);
      setSearchCity('');
    }
  };

  const isSearchPage = location.pathname === '/search';

  return (
    <nav className="sticky top-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <h1 className="font-bold text-lg text-slate-900">BUNYAD</h1>
          </Link>


          {/* Right Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-slate-700 hover:text-green-400 text-sm font-medium transition">
              Browse
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-slate-700 hover:text-green-400 text-sm font-medium transition">
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-green-400 hover:text-green-500 text-sm font-medium transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-green-400 text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  List Property
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} className="text-amber-900" /> : <Menu size={24} className="text-amber-900" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 pt-4">
            <Link to="/search" className="block text-slate-700 hover:text-green-400 py-2 text-sm font-medium">
              Browse Properties
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="block text-slate-700 hover:text-green-400 py-2 text-sm font-medium">
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-slate-700 hover:text-green-400 py-2 text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-slate-700 hover:text-green-400 py-2 text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="block btn-primary w-full text-center text-sm">
                  List Property
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
