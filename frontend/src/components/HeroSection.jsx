import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Shield, Zap, Layout } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const HeroSection = () => {
  const { user } = useAuthStore();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-12 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:scale-105 transition-transform duration-300 cursor-default"
          style={{ willChange: "transform, opacity" }}
        >
          <Sparkles size={16} className="animate-pulse" />
          <span>New: NexNotes Pro is here</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping ml-1" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold text-soft-white mb-8 tracking-tight"
          style={{ willChange: "transform, opacity" }}
        >
          Capture Ideas at the <br />
          <span className="text-gradient italic">Speed of Thought</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="text-xl text-muted-gray mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ willChange: "transform, opacity" }}
        >
          The most advanced note-taking experience for creators. Organize your life with glass-pure clarity and futuristic power.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          style={{ willChange: "transform, opacity" }}
        >
          {user ? (
            <Link to="/notes" className="btn-primary px-10 py-4 text-lg group">
              <Layout className="group-hover:rotate-12 transition-transform" size={20} />
              My Notes
            </Link>
          ) : (
            <Link to="/signup" className="btn-primary px-10 py-4 text-lg">
              Get Started Free
            </Link>
          )}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: <Zap className="text-primary" />, title: "Ultra Fast", desc: "Built with speed in mind" },
            { icon: <Shield className="text-primary" />, title: "Secure", desc: "End-to-end encryption" },
            { icon: <Sparkles className="text-primary" />, title: "NexNotes", desc: "Smart organization" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + (index * 0.1) }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-soft-white/5 border border-soft-white/10 backdrop-blur-md hover:bg-soft-white/10 transition-all duration-300 group shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-primary/5">
                {item.icon}
              </div>
              <h3 className="text-soft-white text-xl font-bold">{item.title}</h3>
              <p className="text-muted-gray leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10" />
    </section>
  );
};

export default HeroSection;
