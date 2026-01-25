import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  variant = 'default',
  padding = 'md',
  ...props 
}) => {
  const variants = {
    default: 'bg-white/95 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.12] backdrop-blur-xl',
    elevated: 'bg-white/95 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.12] backdrop-blur-xl shadow-2xl',
    minimal: 'bg-white/90 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] backdrop-blur-lg',
    accent: 'bg-white/95 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.12] backdrop-blur-xl neon-accent'
  };

  const paddings = {
    none: '',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className={`
        ${variants[variant]} 
        ${paddings[padding]} 
        rounded-2xl 
        ${hover ? 'glass-card-hover cursor-pointer' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
