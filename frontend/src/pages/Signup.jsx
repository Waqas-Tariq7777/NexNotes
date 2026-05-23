import React from 'react';
import SignupForm from '../components/SignupForm';
import { motion } from 'framer-motion';
import { Notebook, Sparkles, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-rich-black">
      {/* Left Side - Visuals */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-[60%] relative items-center justify-center p-12 overflow-hidden border-r border-white/5"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />

        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30">
              <Notebook className="text-white w-12 h-12" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Join <span className="text-gradient">NexNotes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-muted-gray leading-relaxed mb-12"
          >
            Create your account and start your journey with the world's most beautiful note-taking platform.
          </motion.p>

          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <Zap size={24} />, label: "Speed" },
              { icon: <Shield size={24} />, label: "Privacy" },
              { icon: <Sparkles size={24} />, label: "Beauty" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="text-secondary">{item.icon}</div>
                <span className="text-xs text-muted-gray font-medium uppercase tracking-widest">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 lg:w-[40%] flex items-start md:items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 relative z-10 pt-36 pb-16 md:py-12"
      >
        {/* Mobile Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10 md:hidden" />

        <div className="w-full max-w-md glass-card p-6 sm:p-10 relative overflow-hidden shadow-2xl bg-white/[0.03] backdrop-blur-[30px] border-white/10">
          {/* Internal Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-10 bg-secondary pointer-events-none" />

          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Notebook className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Nex<span className="text-primary">Notes</span></h1>
          </div>
          <SignupForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
