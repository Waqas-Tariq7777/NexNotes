import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const About = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
          About <span className="text-gradient">NexNotes</span>
        </h1>
        <GlassCard className="p-12">
          <p className="text-xl text-muted-gray leading-relaxed mb-8">
            NexNotes is more than just a note-taking app. It's a sanctuary for your thoughts, designed with a focus on speed, privacy, and premium aesthetics.
          </p>
          <p className="text-xl text-muted-gray leading-relaxed">
            Our mission is to empower creators and thinkers by providing a seamless, futuristic interface that disappears and lets your ideas flow naturally.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default About;
