import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { Mail, MessageSquare, Globe } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-soft-white mb-12 tracking-tight">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: <Mail className="text-primary" size={32} />, title: "Email", value: "waqastariq9101@gmail.com" },
            { icon: <MessageSquare className="text-primary" size={32} />, title: "Support", value: "24/7 Live Chat" },
            { icon: <Globe className="text-primary" size={32} />, title: "Office", value: "Mirpur AJK" }
          ].map((item, i) => (
            <GlassCard key={i} className="flex flex-col items-center text-center gap-6 p-10 hover:border-primary/30 transition-all duration-500 group">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/50 group-hover:bg-primary/10 transition-all duration-500 shadow-2xl">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h4 className="text-soft-white text-2xl font-black tracking-tight">{item.title}</h4>
                <p className="text-muted-gray font-medium text-lg">{item.value}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
