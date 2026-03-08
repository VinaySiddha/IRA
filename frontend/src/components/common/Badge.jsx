const variantStyles = {
  info: 'bg-info/[0.12] text-info',
  success: 'bg-success/[0.12] text-success',
  warning: 'bg-warning/[0.12] text-warning',
  error: 'bg-error/[0.12] text-error',
  primary: 'bg-primary/[0.12] text-primary',
  secondary: 'bg-secondary/[0.12] text-secondary',
};

export default function Badge({
  children,
  variant = 'info',
  className = '',
  size = 'md',
}) {
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
