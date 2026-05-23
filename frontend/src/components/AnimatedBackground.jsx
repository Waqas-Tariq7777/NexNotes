import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocation } from 'react-router-dom';

const AnimatedBackground = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isNotesPage = location.pathname === '/notes';

  // Completely disable floating orbs on mobile or on notes page for flawless performance
  const showOrbs = !isMobile && !isNotesPage;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-rich-black">
      {/* Dynamic Mesh Layer */}
      <div className="absolute inset-0 animate-mesh opacity-20 dark:opacity-30" />
      
      {/* Floating Orbs */}
      {showOrbs && (
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, 50, 100, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
            style={{ willChange: "transform, opacity" }}
          />
          
          <motion.div
            animate={{
              x: [0, -80, 50, 0],
              y: [0, 100, -50, 0],
              scale: [1, 1.3, 1, 1.3],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[5%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px]"
            style={{ willChange: "transform, opacity" }}
          />

          <motion.div
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -100, 50, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[80px]"
            style={{ willChange: "transform, opacity" }}
          />
        </div>
      )}

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Overlay Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
