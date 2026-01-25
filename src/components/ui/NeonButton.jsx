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
    primary: 'text-white bg-[#2E7D32] hover:bg-[#1B5E20] border-[#2E7D32] shadow-lg hover:shadow-[#2E7D32]/25 dark:bg-primary-500/90 dark:hover:bg-primary-500 dark:border-primary-400/50 dark:hover:shadow-primary-500/25',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:text-white dark:border-white/[0.12] dark:hover:border-white/[0.2]',
    danger: 'text-white bg-[#D32F2F] hover:bg-[#B71C1C] border-[#D32F2F] shadow-lg dark:bg-red-500/90 dark:hover:bg-red-500 dark:border-red-400/50 dark:hover:shadow-red-500/25',
    outline: 'bg-transparent hover:bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30 hover:border-[#2E7D32]/50 dark:hover:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30 dark:hover:border-primary-500/50',
    glass: 'glass-button text-white dark:text-primary-400 dark:hover:text-primary-300'
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
