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
    <aside className="glass-sidebar w-64 min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <h1 className="text-4xl font-gaming font-bold holographic-text">
          SAMEERA RICE
        </h1>
        <p className="text-xs text-primary-400 mt-1">Inventory System</p>
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
                ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500' 
                : 'text-gray-400 hover:bg-white/5 hover:text-primary-400'
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
            text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
        <p className="text-xs text-gray-500 text-center">© Dulan Karunarathna</p>
      </div>
    </aside>
  );
};

export default GamingSidebar;