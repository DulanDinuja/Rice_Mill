import { Package, Wheat, TrendingUp, Warehouse } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import GlassCard from '../components/ui/GlassCard';

const Dashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-gaming font-bold bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] dark:from-primary-500 dark:to-secondary-500 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-[#546E7A] dark:text-gray-400">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Rice Stock"
          value="2,500 kg"
          icon={Package}
          trend={12}
          color="primary"
        />
        <StatsCard
          title="Total Paddy Stock"
          value="8,500 kg"
          icon={Wheat}
          trend={8}
          color="secondary"
        />
        <StatsCard
          title="Total Revenue"
          value="₹2.5L"
          icon={TrendingUp}
          trend={15}
          color="accent"
        />
        <StatsCard
          title="Warehouses"
          value="2"
          icon={Warehouse}
          trend={0}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-[#263238] dark:text-white mb-3 md:mb-4">Recent Activity</h3>
          <div className="space-y-2 md:space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#F8FAF9] to-[#FAFBFA] dark:from-white/[0.08] dark:to-white/[0.12] dark:bg-gradient-to-br border border-[#E8F5E9] dark:border-white/30 shadow-sm dark:shadow-lg dark:shadow-black/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#388E3C] dark:from-primary-400 dark:to-primary-500 shadow-sm shadow-[#2E7D32]/30 dark:shadow-primary-500/60 dark:animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#263238] dark:text-gray-100">Stock updated: Basmati Rice</p>
                  <p className="text-xs text-[#78909C] dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-[#263238] dark:text-white mb-3 md:mb-4">Low Stock Alert</h3>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#FFF8E1] to-[#FFFDE7] dark:from-yellow-900/30 dark:to-yellow-800/20 dark:bg-gradient-to-br border border-[#FFE082] dark:border-yellow-500/50 shadow-sm dark:shadow-lg dark:shadow-yellow-900/30 backdrop-blur-sm">
              <div>
                <p className="text-sm font-medium text-[#263238] dark:text-gray-100">Jasmine Rice</p>
                <p className="text-xs text-[#78909C] dark:text-gray-400">Only 200 kg remaining</p>
              </div>
              <span className="text-[#E65100] dark:text-yellow-200 text-sm font-bold px-3 py-1.5 rounded-lg bg-[#FFE0B2] dark:bg-yellow-500/40 border border-transparent dark:border-yellow-400/50 shadow-sm dark:shadow-yellow-500/30">Low</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
