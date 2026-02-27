const HolographicBadge = ({ children, status = 'default', size = 'md', className = '' }) => {
  const statusColors = {
    success: 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500',
    warning: 'bg-[#F9A825]/10 text-[#F9A825] border-[#F9A825]/30 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500',
    danger: 'bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500',
    info: 'bg-[#1976D2]/10 text-[#1976D2] border-[#1976D2]/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500',
    default: 'bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border
      font-medium backdrop-blur-sm whitespace-nowrap
      ${statusColors[status]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default HolographicBadge;
