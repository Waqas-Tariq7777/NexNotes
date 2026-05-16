import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={hover ? { 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
      className={`glass-card ${hover ? 'glass-card-hover' : ''} p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
