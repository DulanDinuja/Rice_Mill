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
        minimal: 'bg-white/[0.04] border border-white/[0.06] backdrop-blur-md dark:bg-white/[0.04] dark:border-white/[0.06]',
        solid: 'bg-white border-gray-200 dark:bg-dark-card dark:border-white/[0.1]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
        >
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-primary/70 dark:text-primary-400/70">
                        <Icon size={18} />
                    </div>
                )}
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`
            w-full ${sizes[size]} ${variants[variant]}
            bg-white/70 dark:bg-black/40 backdrop-blur-md
            text-gray-900 dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            transition-all duration-200 ease-out
            focus:outline-none 
            focus:ring-2 focus:ring-light-primary/20 dark:focus:ring-primary-400/20
            focus:border-light-primary dark:focus:border-primary-400
            [color-scheme:light] dark:[color-scheme:dark]
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 dark:border-red-400/50 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' : ''}
            ${className}
          `}
                    style={{
                        WebkitTextFillColor: 'inherit',
                        WebkitOpacity: 1,
                    }}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-light-danger dark:text-red-400 flex items-center gap-1"
                >
                    <span className="w-1 h-1 bg-light-danger dark:bg-red-400 rounded-full" />
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
};

export default CyberInput;
