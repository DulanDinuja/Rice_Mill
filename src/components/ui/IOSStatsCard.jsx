import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const IOSStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'primary',
  subtitle,
  className = '' 
}) => {
  const colors = {
    primary: {
      bg: 'from-primary-500/20 to-primary-600/10',
      border: 'border-primary-500/30',
      icon: 'text-primary-400',
      glow: 'ios-glow-primary'
    },
    secondary: {
      bg: 'from-secondary-500/20 to-secondary-600/10',
      border: 'border-secondary-500/30', 
      icon: 'text-secondary-400',
      glow: 'ios-glow-secondary'
    },
    accent: {
      bg: 'from-accent-500/20 to-accent-600/10',
      border: 'border-accent-500/30',
      icon: 'text-accent-400',
      glow: 'ios-glow-accent'
    },
    success: {
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      glow: 'shadow-green-500/20'
    }
  };

  const colorScheme = colors[color];
  const isPositiveTrend = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -6, 
        scale: 1.03,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className={`
        ios-card-primary
        bg-gradient-to-br ${colorScheme.bg}
        border ${colorScheme.border}
        ${colorScheme.glow}
        p-6 cursor-pointer
        ios-smooth
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorScheme.bg} ${colorScheme.border} border`}>
          <Icon className={`w-6 h-6 ${colorScheme.icon}`} />
        </div>
        
        {trend !== undefined && trend !== 0 && (
          <motion.div 
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${isPositiveTrend 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            {isPositiveTrend ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>
      
      <div className="space-y-1">
        <motion.h3 
          className="text-sm font-medium text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.p>
        
        {subtitle && (
          <motion.p 
            className="text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.bg.split(' ')[1]}, transparent)`
        }}
        initial={false}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
      />
    </motion.div>
  );
};

export default IOSStatsCard;