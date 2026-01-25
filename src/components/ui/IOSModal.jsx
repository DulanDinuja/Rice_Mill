import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const IOSModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  variant = 'modal',
  className = '' 
}) => {
  const sizes = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-xl md:max-w-2xl',
    xl: 'max-w-xl sm:max-w-2xl md:max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const variants = {
    modal: 'ios-modal',
    sheet: 'ios-sheet',
    notification: 'ios-notification'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const sheetVariants = {
    hidden: { 
      opacity: 0, 
      y: '100%' 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: '100%',
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          <motion.div
            className={`
              relative w-full ${sizes[size]} my-auto
              ${variants[variant]}
              ${variant === 'sheet' ? 'sm:relative sm:mx-4 sm:rounded-2xl fixed bottom-0 left-0 right-0 mx-0 rounded-b-none' : ''}
              ${className}
            `}
            variants={variant === 'sheet' ? sheetVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {variant === 'sheet' && (
              <div className="flex justify-center pt-3 pb-2 sm:hidden">
                <div className="w-10 h-1 bg-gray-300 dark:bg-white/30 rounded-full" />
              </div>
            )}
            
            {title && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 ios-smooth"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-700 dark:text-white" />
                </motion.button>
              </div>
            )}
            
            <div className={title ? 'p-4 sm:p-6' : 'p-4 sm:p-6'}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IOSModal;