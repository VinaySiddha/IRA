import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  gradient = false,
  elevation = 2,
}) {
  const elevationClasses = {
    0: '',
    1: 'elevation-1',
    2: 'elevation-2',
    3: 'elevation-3',
    4: 'elevation-4',
    6: 'elevation-6',
    8: 'elevation-8',
  };

  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
            }
          : {}
      }
      onClick={onClick}
      className={`
        bg-surface rounded-xl
        ${elevationClasses[elevation] || 'elevation-2'}
        ${hover ? 'hover-elevate cursor-pointer' : ''}
        ${gradient ? 'hover:border hover:border-primary/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-md
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
