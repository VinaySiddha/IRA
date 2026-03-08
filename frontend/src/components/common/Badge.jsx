const variantStyles = {
  info: 'bg-google-blue/[0.08] text-google-blue',
  success: 'bg-google-green/[0.08] text-google-green',
  warning: 'bg-google-yellow/[0.12] text-[#E37400]',
  error: 'bg-google-red/[0.08] text-google-red',
  primary: 'bg-google-blue/[0.08] text-google-blue',
  secondary: 'bg-google-green/[0.08] text-google-green',
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
