import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-primary text-white elevation-2 hover:elevation-4 hover:bg-primary-dark',
  secondary:
    'bg-secondary text-white elevation-2 hover:elevation-4 hover:bg-secondary-dark',
  outline:
    'border-2 border-primary text-primary hover:bg-primary/[0.04]',
  ghost:
    'text-primary hover:bg-primary/[0.04]',
  danger:
    'bg-error text-white elevation-2 hover:elevation-4',
  tonal:
    'bg-primary/[0.12] text-primary hover:bg-primary/[0.2]',
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
