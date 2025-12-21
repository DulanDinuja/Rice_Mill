import { Bell, User, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CyberNavbar = () => {
  const { user } = useAuth();

  return (
    <nav className="glass-navbar h-16 fixed top-0 left-64 right-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stocks, warehouses..."
            className="w-full glass-input rounded-lg pl-11 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell size={20} className="text-primary-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-neon-pulse" />
        </button>

        <div className="flex items-center gap-3 px-4 py-2 glass-card rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CyberNavbar;