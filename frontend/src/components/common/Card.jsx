import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  gradient = false,
  elevation = 0,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -2,
              transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
            }
          : {}
      }
      onClick={onClick}
      className={`
        devfest-card
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
