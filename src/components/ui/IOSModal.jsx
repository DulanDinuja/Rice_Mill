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
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
              relative w-full ${sizes[size]} mx-4
              ${variants[variant]}
              ${variant === 'sheet' ? 'fixed bottom-0 left-0 right-0 mx-0 rounded-b-none' : ''}
              ${className}
            `}
            variants={variant === 'sheet' ? sheetVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {variant === 'sheet' && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/30 rounded-full" />
              </div>
            )}
            
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 ios-smooth"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            )}
            
            <div className={title ? 'p-6' : 'p-6'}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IOSModal;