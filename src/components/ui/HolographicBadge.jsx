const HolographicBadge = ({ children, status = 'default', size = 'md' }) => {
  const statusColors = {
    success: 'bg-primary-500/20 text-primary-400 border-primary-500',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    danger: 'bg-red-500/20 text-red-400 border-red-500',
    info: 'bg-accent-500/20 text-accent-400 border-accent-500',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border
      font-medium backdrop-blur-sm
      ${statusColors[status]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
};

export default HolographicBadge;
