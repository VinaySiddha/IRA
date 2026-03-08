import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-google-blue text-white hover:bg-primary-dark elevation-1',
  secondary:
    'bg-google-green text-white hover:bg-secondary-dark elevation-1',
  outline:
    'border-2 border-google-blue text-google-blue hover:bg-google-blue/[0.04]',
  ghost:
    'text-google-blue hover:bg-google-blue/[0.04]',
  danger:
    'bg-google-red text-white hover:opacity-90 elevation-1',
  tonal:
    'bg-google-blue/[0.08] text-google-blue hover:bg-google-blue/[0.16]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-medium
        tracking-wide uppercase
        transition-md
        cursor-pointer
        disabled:opacity-[0.38] disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </motion.button>
  );
}
