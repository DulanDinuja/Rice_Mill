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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        glass-sidebar w-64 h-screen fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        flex flex-col overflow-hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-2 right-2 p-2 rounded-lg hover:bg-white/10 md:hidden z-10"
        >
          <X size={20} className="text-light-textMuted dark:text-gray-300" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6 mt-2 md:mt-[10px]">
          <div className="flex items-center gap-0">
            <img
              src="/logo.png"
              alt="Sameera Rice Logo"
              className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] lg:w-45 lg:h-55 object-contain flex-shrink-0 -mt-3 sm:-mt-5 -ml-[28px] sm:-ml-[18px] md:-ml-[40px] lg:-ml-[47px]"
            />
            <div className="-ml-[25px] sm:-ml-[5px] md:-ml-[35px] lg:-ml-[43px] mt-3 sm:-mt-[25px] md:mt-3 lg:-mt-[0px]">
              <h1 className="text-xl sm:text-xl md:text-3xl lg:text-6xl xl:text-5xl font-['Brush_Script_MT'] font-normal italic tracking-tight whitespace-nowrap drop-shadow-lg animate-signature-color scale-x-85 scale-y-90" style={{ lineHeight: '1.8' }}>
                ameera Rice
              </h1>
            </div>
          </div>
          <p className="text-xs mt-1 sm:mt-2 text-light-primary dark:text-primary-400 font-medium">Inventory System</p>
        </div>

        <nav className="px-3 space-y-1.5 sm:space-y-2 pb-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-primary-500/25 dark:to-primary-600/20 text-green-900 dark:text-primary-300 border-l-4 border-light-primary dark:border-primary-400 shadow-md dark:shadow-primary-500/20 font-semibold' 
                  : 'text-light-textMuted dark:text-gray-300 bg-light-background dark:bg-white/[0.03] hover:bg-gradient-to-r hover:from-green-50 hover:to-light-background dark:hover:from-green-500/20 dark:hover:to-green-600/10 hover:text-light-primary dark:hover:text-green-300 hover:shadow-md hover:-translate-y-0.5 shadow-sm border border-transparent hover:border-green-100 dark:hover:border-green-500/30'
                }
              `}
            >
              <item.icon size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout section inside scrollable area */}
        <div className="px-3 pb-3 space-y-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full
              transition-all duration-300
              text-light-danger dark:text-red-300
              bg-red-50 dark:bg-white/[0.03]
              hover:bg-gradient-to-r hover:from-red-100 hover:to-red-50 dark:hover:bg-red-500/20
              border border-red-200 dark:border-transparent
              hover:shadow-md hover:-translate-y-0.5
              font-medium shadow-sm text-sm sm:text-base"
          >
            <LogOut size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
            <span>Logout</span>
          </button>
          <div className="h-px bg-gradient-to-r from-transparent via-green-100 dark:via-white/10 to-transparent" />
          <p className="text-xs text-center text-light-textMuted dark:text-gray-400 font-medium">© Dulan Karunarathna</p>
        </div>
      </div>
      </aside>
    </>
  );
};

export default GamingSidebar;