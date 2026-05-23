import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import WorkspacePlayground from '../components/WorkspacePlayground';
import PricingSection from '../components/PricingSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Layout } from 'lucide-react';

const Home = () => {
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturesSection />
      <WorkspacePlayground />
      <PricingSection />
      
      {/* Dynamic CTA Section before footer */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="glass-card p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold text-soft-white mb-8">
                Ready to transform your workflow?
              </h2>
              <p className="text-muted-gray text-lg mb-12 max-w-2xl mx-auto">
                Join thousands of creators who are already using NexNotes to bring their ideas to life.
              </p>
              {user ? (
                <Link to="/notes" className="btn-primary px-12 py-5 text-xl shadow-2xl shadow-primary/20 group">
                  <Layout className="group-hover:rotate-12 transition-transform" size={24} />
                  My Notes
                </Link>
              ) : (
                <Link to="/signup" className="btn-primary px-12 py-5 text-xl shadow-2xl shadow-primary/20">
                  Get Started for Free
                </Link>
              )}
            </div>
            
            {/* Background Glow for CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
