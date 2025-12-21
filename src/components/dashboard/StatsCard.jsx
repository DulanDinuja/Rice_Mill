import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary-500 bg-primary-500/10',
    secondary: 'text-secondary-500 bg-secondary-500/10',
    accent: 'text-accent-500 bg-accent-500/10',
    success: 'text-green-500 bg-green-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10'
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
    </GlassCard>
  );
};

export default StatsCard;
