import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Notebook, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer 
      className="backdrop-blur-xl border-t border-white/10 pt-24 pb-12 relative z-10"
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                <Notebook className="text-rich-black w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-soft-white">Nex<span className="text-primary">Notes</span></span>
            </Link>
            <p className="text-muted-gray leading-relaxed text-base">
              The next generation of digital thought. Experience clarity, speed, and privacy in every note you take.
            </p>
            <div className="flex gap-4">
              {[
                { 
                  icon: <Instagram size={20} />, 
                  href: "https://www.instagram.com/waqas_tariq77?igsh=MWoyNTZmc203NjhyYQ%3D%3D&utm_source=chatgpt.com",
                  label: "Instagram"
                },
                { 
                  icon: <Linkedin size={20} />, 
                  href: "https://www.linkedin.com/in/waqas-tariq-9a0a2b332?utm_content=profile&utm_medium=member_ios&utm_source=chatgpt.com",
                  label: "LinkedIn"
                },
                { 
                  icon: <Github size={20} />, 
                  href: "https://github.com/Waqas-Tariq7777?utm_source=chatgpt.com",
                  label: "GitHub"
                }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-gray hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Section */}
          <div className="lg:pl-10">
            <h4 className="text-soft-white font-bold mb-8 text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Company
            </h4>
            <ul className="space-y-5">
              <li><Link to="/" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" /> Home Page</Link></li>
              <li><Link to="/about" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" /> About Us</Link></li>
              <li><Link to="/contact" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="lg:pl-6">
            <h4 className="text-soft-white font-bold mb-8 text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Legal
            </h4>
            <ul className="space-y-5">
              <li><a href="#" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-secondary transition-all duration-300" /> Privacy Policy</a></li>
              <li><a href="#" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-secondary transition-all duration-300" /> Terms of Service</a></li>
              <li><a href="#" className="text-muted-gray hover:text-white transition-colors text-base flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-secondary transition-all duration-300" /> Cookie Settings</a></li>
            </ul>
          </div>

          {/* Entertainment Section */}
          <div className="space-y-8">
            <h4 className="text-soft-white font-bold mb-8 text-lg flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              Daily Spark
            </h4>
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md group-hover:border-accent/30 transition-all duration-300">
                <p className="text-sm text-muted-gray italic leading-relaxed mb-4">
                  "The best way to predict the future is to create it. Start by taking the first note."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-gray uppercase tracking-widest">
                    <Heart size={12} className="text-accent animate-pulse" />
                    <span>Stay Inspired</span>
                  </div>
                  <span className="text-[10px] text-accent/50 font-mono">05.14.2026</span>
                </div>
              </div>
            </div>
            <p className="text-xs  text-muted-gray leading-relaxed px-2">
              Fun Fact: Did you know that the average person has 6,200 thoughts per day? NexNotes helps you catch the best ones.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/5 pt-10">
          <p className="text-center text-muted-gray text-sm tracking-wide">
            © {new Date().getFullYear()} <span className="text-soft-white font-medium">NexNotes</span>. Designed with passion for the future of productivity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
