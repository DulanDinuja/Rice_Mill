import { useState, useEffect } from 'react';
import { Package, Wheat, TrendingUp, Warehouse } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import GlassCard from '../components/ui/GlassCard';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    riceStock: { totalStock: 0, percentageChange: 0, isIncrease: true },
    brokenPolishRice: { brokenRiceQuantity: 0, polishRiceQuantity: 0 },
    paddyStock: { totalStock: 0, percentageChange: 0, isIncrease: true },
    revenue: { totalRevenue: 0, percentageChange: 0, isIncrease: true },
    warehouses: { totalWarehouses: 0 }
  });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [riceRes, brokenPolishRes, paddyRes, revenueRes, warehousesRes, activitiesRes, alertsRes] = await Promise.all([
        dashboardService.getTotalRiceStock(),
        dashboardService.getBrokenAndPolishRiceQuantity(),
        dashboardService.getTotalPaddyStock(),
        dashboardService.getTotalRevenue(),
        dashboardService.getTotalWarehouses(),
        dashboardService.getRecentActivities(),
        dashboardService.getLowStockAlerts()
      ]);

      setStats({
        riceStock: riceRes.data,
        brokenPolishRice: brokenPolishRes.data,
        paddyStock: paddyRes.data,
        revenue: revenueRes.data,
        warehouses: warehousesRes.data
      });
      setActivities(activitiesRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (amount) => {
    if (amount >= 100000) {
      return `Rs. ${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${amount.toFixed(0)}`;
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-500/50';
      case 'Low':
        return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-500/50';
      default:
        return 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-500/50';
    }
  };

  const getAlertTextColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'text-red-600 dark:text-red-200 bg-red-100 dark:bg-red-500/40';
      case 'Low':
        return 'text-yellow-600 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-500/40';
      default:
        return 'text-orange-600 dark:text-orange-200 bg-orange-100 dark:bg-orange-500/40';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-gaming font-bold bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] dark:from-primary-500 dark:to-secondary-500 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-[#546E7A] dark:text-gray-400">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        <StatsCard
          title="Total Rice Stock"
          value={`${stats.riceStock.totalStock.toLocaleString()} kg`}
          icon={Package}
          trend={stats.riceStock.percentageChange}
          color="primary"
        />
        <GlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#2E7D32]/10 dark:bg-primary-500/20">
              <Package className="text-[#2E7D32] dark:text-primary-400" size={24} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Broken & Polish Rice</h3>
          </div>
          <div className="space-y-2">
            <p className="text-base text-gray-700 dark:text-gray-300">Broken Rice: <span className="text-xl font-bold">{stats.brokenPolishRice.brokenRiceQuantity.toLocaleString()} kg</span></p>
            <p className="text-base text-gray-700 dark:text-gray-300">Polish Rice: <span className="text-xl font-bold">{stats.brokenPolishRice.polishRiceQuantity.toLocaleString()} kg</span></p>
          </div>
        </GlassCard>
        <StatsCard
          title="Total Paddy Stock"
          value={`${stats.paddyStock.totalStock.toLocaleString()} kg`}
          icon={Wheat}
          trend={stats.paddyStock.percentageChange}
          color="secondary"
        />
        <StatsCard
          title="Total Revenue"
          value={formatRevenue(stats.revenue.totalRevenue)}
          icon={TrendingUp}
          trend={stats.revenue.percentageChange}
          color="accent"
        />
        <StatsCard
          title="Warehouses"
          value={stats.warehouses.totalWarehouses.toString()}
          icon={Warehouse}
          trend={0}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-[#263238] dark:text-white mb-3 md:mb-4">Recent Activity</h3>
          <div className="space-y-2 md:space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#F8FAF9] to-[#FAFBFA] dark:from-white/[0.08] dark:to-white/[0.12] dark:bg-gradient-to-br border border-[#E8F5E9] dark:border-white/30 shadow-sm dark:shadow-lg dark:shadow-black/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#388E3C] dark:from-primary-400 dark:to-primary-500 shadow-sm shadow-[#2E7D32]/30 dark:shadow-primary-500/60 dark:animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#263238] dark:text-gray-100">{activity.type}: {activity.description}</p>
                    <p className="text-xs text-[#78909C] dark:text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-[#263238] dark:text-white mb-3 md:mb-4">Low Stock Alert</h3>
          <div className="space-y-2 md:space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No low stock alerts</p>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${getAlertColor(alert.alertLevel)} shadow-sm dark:shadow-lg backdrop-blur-sm`}>
                  <div>
                    <p className="text-sm font-medium text-[#263238] dark:text-gray-100">{alert.itemName}</p>
                    <p className="text-xs text-[#78909C] dark:text-gray-400">Only {alert.quantity} kg remaining</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${getAlertTextColor(alert.alertLevel)} border border-transparent shadow-sm`}>{alert.alertLevel}</span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
