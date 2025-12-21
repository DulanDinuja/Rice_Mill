import { motion } from 'framer-motion';

const IOSButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'ios-button-primary text-white font-medium',
    secondary: 'ios-button-secondary text-white/90 font-medium',
    glass: 'glass-button text-primary-400 hover:text-primary-300',
    outline: 'bg-transparent border-2 border-primary-500/30 hover:border-primary-500/50 text-primary-400 hover:bg-primary-500/10'
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ 
        scale: 0.98, 
        y: 0,
        transition: { type: "spring", stiffness: 600, damping: 30 }
      }}
      className={`
        ${sizes[size]} 
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ios-smooth
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Loading...</span>
        </motion.div>
      ) : (
        <>\n          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}\n          {children}\n          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}\n        </>\n      )}\n    </motion.button>\n  );\n};\n\nexport default IOSButton;