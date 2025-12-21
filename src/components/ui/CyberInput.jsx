import { motion } from 'framer-motion';

const CyberInput = ({ 
  label, 
  error, 
  icon: Icon, 
  size = 'md',
  variant = 'default',
  className = '', 
  ...props 
}) => {
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-sm rounded-xl',
    lg: 'px-5 py-4 text-base rounded-xl'
  };

  const variants = {
    default: 'glass-input',
    minimal: 'bg-white/[0.04] border border-white/[0.06] backdrop-blur-md',
    solid: 'bg-dark-card border border-white/[0.1]'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400/70">
            <Icon size={18} />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            w-full ${sizes[size]} ${variants[variant]}
            text-white placeholder-white/40
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-0
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-400/50 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 flex items-center gap-1"
        >
          <span className="w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default CyberInput;
