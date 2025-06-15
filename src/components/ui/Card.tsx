import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg',
        hover && 'hover:shadow-xl hover:border-gray-600',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
