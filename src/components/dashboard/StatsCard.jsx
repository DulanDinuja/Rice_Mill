import GlassCard from '../ui/GlassCard';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-[#2E7D32] bg-[#2E7D32]/10 dark:text-primary-500 dark:bg-primary-500/10',
    secondary: 'text-[#66BB6A] bg-[#66BB6A]/10 dark:text-secondary-500 dark:bg-secondary-500/10',
    accent: 'text-[#F9A825] bg-[#F9A825]/10 dark:text-accent-500 dark:bg-accent-500/10',
    success: 'text-[#2E7D32] bg-[#2E7D32]/10 dark:text-green-500 dark:bg-green-500/10',
    warning: 'text-[#F9A825] bg-[#F9A825]/10 dark:text-yellow-500 dark:bg-yellow-500/10'
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2E7D32] dark:via-primary-500 to-transparent opacity-50" />
    </GlassCard>
  );
};

export default StatsCard;
