import { motion } from 'framer-motion';

const IOSCard = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  interactive = true,
  glow = false,
  ...props 
}) => {
  const variants = {
    primary: 'ios-card-primary',
    secondary: 'ios-card-secondary',
    glass: 'ios-glass',
    elevated: 'ios-glass-elevated'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-10'
  };

  const glowEffect = glow ? 'ios-glow-primary' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={interactive ? { 
        y: -4, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${glowEffect}
        ${interactive ? 'cursor-pointer ios-smooth' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default IOSCard;