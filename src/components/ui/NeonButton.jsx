import { motion } from 'framer-motion';

const NeonButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false, 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500/90 hover:bg-primary-500 text-white border-primary-400/50 shadow-lg hover:shadow-primary-500/25',
    secondary: 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.12] hover:border-white/[0.2]',
    danger: 'bg-red-500/90 hover:bg-red-500 text-white border-red-400/50 shadow-lg hover:shadow-red-500/25',
    outline: 'bg-transparent hover:bg-primary-500/10 text-primary-400 border-primary-500/30 hover:border-primary-500/50',
    glass: 'glass-button text-primary-400 hover:text-primary-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
    xl: 'px-10 py-5 text-lg rounded-2xl'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${sizes[size]} font-medium border 
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        backdrop-blur-sm
        ${variants[variant]}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.span 
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Loading...</span>
        </span>
      ) : children}
    </motion.button>
  );
};

export default NeonButton;
