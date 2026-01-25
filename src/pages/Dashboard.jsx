import { Package, Wheat, TrendingUp, Warehouse } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import GlassCard from '../components/ui/GlassCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-white/5">
                <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-primary-500 animate-neon-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Stock updated: Basmati Rice</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Jasmine Rice</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Only 200 kg remaining</p>
              </div>
              <span className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">Low</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
