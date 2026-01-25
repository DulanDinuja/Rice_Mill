import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Wheat, FileText, Warehouse, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { ROUTES } from '../../utils/constants';

const GamingSidebar = () => {
  const { logout } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useSidebar();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
    { icon: Package, label: 'Rice Stock', path: ROUTES.RICE_STOCK },
    { icon: Wheat, label: 'Paddy Stock', path: ROUTES.PADDY_STOCK },
    { icon: FileText, label: 'Reports', path: ROUTES.REPORTS },
    { icon: Warehouse, label: 'Warehouse', path: ROUTES.WAREHOUSE },
    { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS }
  ];


  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        glass-sidebar w-64 min-h-screen fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 lg:hidden"
        >
          <X size={24} className="text-light-textMuted dark:text-gray-300" />
        </button>

        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-gaming font-bold holographic-text">
            SAMEERA RICE
          </h1>
          <p className="text-xs mt-1 text-light-primary dark:text-primary-400 font-medium">Inventory System</p>
        </div>

        <nav className="px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-primary-500/25 dark:to-primary-600/20 text-green-900 dark:text-primary-300 border-l-4 border-light-primary dark:border-primary-400 shadow-md dark:shadow-primary-500/20 font-semibold' 
                  : 'text-light-textMuted dark:text-gray-300 bg-light-background dark:bg-white/[0.03] hover:bg-gradient-to-r hover:from-green-50 hover:to-light-background dark:hover:bg-white/10 hover:text-light-primary dark:hover:text-primary-300 hover:shadow-md hover:-translate-y-0.5 shadow-sm border border-transparent hover:border-green-100 dark:hover:border-transparent'
                }
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-3 right-3 space-y-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full
              transition-all duration-300
              text-light-danger dark:text-red-300
              bg-red-50 dark:bg-white/[0.03]
              hover:bg-gradient-to-r hover:from-red-100 hover:to-red-50 dark:hover:bg-red-500/20
              border border-red-200 dark:border-transparent
              hover:shadow-md hover:-translate-y-0.5
              font-medium shadow-sm"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
          <div className="h-px bg-gradient-to-r from-transparent via-green-100 dark:via-white/10 to-transparent" />
          <p className="text-xs text-center text-light-textMuted dark:text-gray-400 font-medium">© Dulan Karunarathna</p>
        </div>
      </aside>
    </>
  );
};

export default GamingSidebar;