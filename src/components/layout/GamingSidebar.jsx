import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Wheat, FileText, Warehouse, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

const GamingSidebar = () => {
  const { logout } = useAuth();


  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
    { icon: Package, label: 'Rice Stock', path: ROUTES.RICE_STOCK },
    { icon: Wheat, label: 'Paddy Stock', path: ROUTES.PADDY_STOCK },
    { icon: FileText, label: 'Reports', path: ROUTES.REPORTS },
    { icon: Warehouse, label: 'Warehouse', path: ROUTES.WAREHOUSE },
    { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS }
  ];

  return (
    <aside className="glass-sidebar w-64 min-h-screen fixed left-0 top-0 z-40 bg-white dark:bg-transparent">
      <div className="p-6">
        <h1 className="text-4xl font-gaming font-bold holographic-text">
          SAMEERA RICE
        </h1>
        <p className="text-xs mt-1 text-green-700 dark:text-primary-400">Inventory System</p>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-300
              ${isActive 
                ? 'border-l-4 bg-primary-500/20 text-primary-600 dark:text-primary-400 border-primary-500' 
                : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-3 right-3 space-y-2">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
            transition-all duration-300
            text-red-600 dark:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-500">© Dulan Karunarathna</p>
      </div>
    </aside>
  );
};

export default GamingSidebar;