import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover={onClick ? { 
        y: -6, 
        scale: 1.02, 
        transition: { duration: 0.2, ease: "easeOut" } 
      } : { 
        y: -4, 
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onClick={onClick}
      className={`glass-card p-6 rounded-3xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
