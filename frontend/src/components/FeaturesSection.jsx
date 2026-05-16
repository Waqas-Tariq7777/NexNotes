import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { Layers, MousePointer2, Smartphone, Globe, Lock, Share2 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Layers className="text-primary" size={32} />,
      title: "Advanced Organization",
      description: "Keep your workspace tidy with powerful tagging, nested folders, and customizable categories."
    },
    {
      icon: <MousePointer2 className="text-primary" size={32} />,
      title: "Drag & Drop",
      description: "Seamlessly move elements between notes or reorder your workspace with intuitive gestures."
    },
    {
      icon: <Smartphone className="text-primary" size={32} />,
      title: "Mobile Ready",
      description: "Access your ideas anywhere. Our mobile app keeps everything in sync, even offline."
    },
    {
      icon: <Globe className="text-primary" size={32} />,
      title: "Real-time Sync",
      description: "Your data is instantly updated across all devices using our global edge network."
    },
    {
      icon: <Lock className="text-primary" size={32} />,
      title: "Private Vault",
      description: "Secure sensitive information with biometric authentication and zero-knowledge encryption."
    },
    {
      icon: <Share2 className="text-primary" size={32} />,
      title: "Collaboration",
      description: "Work together on shared notebooks with live editing and permission controls."
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-soft-white mb-6"
          >
            Powerful Features for <br />
            <span className="text-primary italic">Modern Thinkers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-gray text-lg max-w-2xl mx-auto"
          >
            Everything you need to capture, organize, and share your ideas in a sleek, minimalist environment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              delay={index * 0.1}
              className="flex flex-col gap-6 group hover:border-primary/50 transition-all duration-500"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-primary/5">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-soft-white mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-gray leading-relaxed text-lg">{feature.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
