import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  gradient = false,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        bg-card rounded-2xl shadow-md
        border border-border/50
        transition-all duration-300
        ${hover ? 'cursor-pointer' : ''}
        ${gradient ? 'hover:border-transparent hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
