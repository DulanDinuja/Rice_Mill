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
    default: 'glass-card',
    elevated: 'glass-card shadow-2xl',
    minimal: 'bg-white/[0.05] border border-white/[0.08] backdrop-blur-lg',
    accent: 'glass-card neon-accent'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
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
