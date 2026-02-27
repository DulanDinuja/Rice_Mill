import { Bell, User, Search, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';

const CyberNavbar = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toggleMobileMenu } = useSidebar();

  return (
    <nav className="glass-navbar h-16 fixed top-0 left-0 md:left-64 right-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleMobileMenu}
        className="p-2 rounded-lg transition-colors hover:bg-[#E8F5E9] dark:hover:bg-white/5 md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-[#2E7D32] dark:text-primary-400" />
      </button>

      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78909C] dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stocks, warehouses..."
            className="w-full glass-input rounded-lg pl-11 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Button */}
        <button className="p-2 rounded-lg transition-colors hover:bg-[#E8F5E9] dark:hover:bg-white/5 sm:hidden">
          <Search size={20} className="text-[#2E7D32] dark:text-primary-400" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-[#E8F5E9] dark:hover:bg-white/5"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={20} className="text-primary-400" />
          ) : (
            <Moon size={20} className="text-[#2E7D32]" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg transition-colors hover:bg-[#E8F5E9] dark:hover:bg-white/5">
          <Bell size={20} className="text-[#2E7D32] dark:text-primary-400" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="hidden sm:flex items-center gap-3 px-3 md:px-4 py-2 glass-card rounded-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#388E3C] dark:from-primary-500 dark:to-secondary-500">
            <User size={16} className="text-white" />
          </div>
          <div className="text-sm hidden md:block">
            <p className="font-medium text-[#263238] dark:text-white">{user?.username || user?.name}</p>
            <p className="text-xs text-[#78909C] dark:text-gray-400">{user?.role || user?.email}</p>
          </div>
        </div>

        {/* Mobile User Icon Only */}
        <button className="sm:hidden p-2 rounded-lg glass-card">
          <User size={20} className="text-[#2E7D32] dark:text-primary-400" />
        </button>
      </div>
    </nav>
  );
};

export default CyberNavbar;