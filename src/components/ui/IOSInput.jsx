import { motion } from 'framer-motion';
import { useState } from 'react';

const IOSInput = ({ 
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  error,
  className = '',
  variant = 'default',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const variants = {
    default: 'ios-input',
    search: 'ios-search',
    glass: 'glass-input'
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          className="block text-sm font-medium text-white/80"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <motion.input
          type={type}
          placeholder={placeholder}
          className={`
            ${variants[variant]}
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            w-full text-white placeholder-white/50
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />
        
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-primary-500/30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default IOSInput;