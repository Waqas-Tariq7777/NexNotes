import React from 'react';
import SignupForm from '../components/SignupForm';
import { motion } from 'framer-motion';
import { Notebook, Sparkles, Zap, Shield } from 'lucide-react';

const Signup = () => {
  return (
    <div className="min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-rich-black pt-[72px] md:pt-[80px]">
      {/* Left Side - Visuals (50% Width) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 py-10 md:py-16 relative items-center justify-center p-6 lg:p-8 overflow-hidden border-r border-white/5"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="relative z-10 max-w-md text-center">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20">
              <Notebook className="text-white w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight"
          >
            Join <span className="text-gradient">NexNotes</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-muted-gray leading-relaxed mb-8 max-w-sm mx-auto"
          >
            Create your account and start your journey with the world's most beautiful note-taking platform.
          </motion.p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Zap size={18} />, label: "Speed" },
              { icon: <Shield size={18} />, label: "Privacy" },
              { icon: <Sparkles size={18} />, label: "Beauty" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.08) }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-secondary">{item.icon}</div>
                <span className="text-[9px] text-muted-gray font-bold uppercase tracking-widest">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form (50% Width) */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-1/2 py-10 md:py-16 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10"
      >
        {/* Mobile Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none -z-10 md:hidden" />
        
        <div className="w-full max-w-md glass-card p-5 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl bg-white/[0.02] backdrop-blur-[25px] border-white/5">
          {/* Internal Accent Glow */}
          <div className="absolute -top-24 -right-24 w-40 h-40 rounded-full blur-[50px] opacity-10 bg-secondary pointer-events-none" />
          
          <SignupForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
