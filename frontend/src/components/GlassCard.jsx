import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

const GlassCard = ({ children, className = "", hover = true, delay = 0 }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
      transition={
        isMobile
          ? { duration: 0.4, ease: "easeOut", delay: delay * 0.5 } // simplified faster entries
          : { 
              duration: 0.8, 
              delay, 
              type: "spring",
              stiffness: 100,
              damping: 15
            }
      }
      whileHover={hover && !isMobile ? { 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
      className={`glass-card ${hover && !isMobile ? 'glass-card-hover' : ''} p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
