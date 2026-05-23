import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Notebook, LogOut, User, ChevronRight, Sun, Moon, Layout, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useIsMobile } from '../hooks/useIsMobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    ...(user ? [{ name: 'My Notes', href: '/notes' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav 
        initial={false}
        animate={
          isMobile 
            ? { y: 0 }
            : {
                y: scrolled ? 16 : 0,
                paddingTop: scrolled ? '0px' : '8px',
                paddingBottom: scrolled ? '0px' : '8px'
              }
        }
        transition={isMobile ? { duration: 0.1 } : { type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 pointer-events-none"
      >
        <div className={`container mx-auto transition-all duration-500 ease-out ${scrolled ? 'max-w-5xl' : 'max-w-full'}`}>
          <div className={`flex justify-between items-center px-6 py-3 rounded-full border transition-all duration-500 pointer-events-auto ${
            scrolled 
            ? 'bg-background/80 backdrop-blur-xl border-soft-white/10 shadow-2xl shadow-primary/10' 
            : 'bg-transparent border-transparent'
          }`}>
            {/* Logo - Hidden on Notes page because it's in the sidebar */}
            {location.pathname !== '/notes' ? (
              <Link to="/" className="flex items-center gap-2 group relative z-[70]">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 shadow-primary/20">
                  <Notebook className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-soft-white group-hover:text-primary transition-colors duration-300">
                  Nex<span className="text-primary group-hover:text-soft-white transition-colors duration-300">Notes</span>
                </span>
              </Link>
            ) : (
              <div className="w-10 h-10 md:w-[280px]" /> // Placeholder to maintain spacing
            )}

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`relative px-5 py-2.5 transition-all duration-300 font-medium group ${isActive(link.href) ? 'text-primary' : 'text-muted-gray hover:text-soft-white'}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <motion.div 
                      layoutId="navCapsule"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-soft-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
                </Link>
              ))}
              
              <div className="flex items-center gap-4 ml-6 pl-6 border-l border-soft-white/10">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full bg-soft-white/5 border border-soft-white/10 text-muted-gray hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-500"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {user ? (
                  <div className="relative" ref={profileRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-soft-white/5 border border-soft-white/10 text-muted-gray hover:bg-soft-white/10 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <User size={16} className="text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-soft-white">{user.fullName.split(' ')[0]}</span>
                      <ChevronRight className={`w-4 h-4 text-muted-gray transition-transform duration-300 ${isProfileOpen ? 'rotate-90' : 'rotate-0'}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-background/95 backdrop-blur-2xl border border-soft-white/10 rounded-2xl shadow-2xl p-2 z-[80]"
                        >
                          <Link 
                            to="/profile" 
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-soft-white/5 transition-all group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserCircle size={20} className="text-muted-gray group-hover:text-primary" />
                            <span className="text-sm font-medium text-soft-white">My Profile</span>
                          </Link>
                          <Link 
                            to="/notes" 
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-soft-white/5 transition-all group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Layout size={20} className="text-muted-gray group-hover:text-primary" />
                            <span className="text-sm font-medium text-soft-white">My Notes</span>
                          </Link>
                          <hr className="border-soft-white/5 my-2" />
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group"
                          >
                            <LogOut size={20} className="text-muted-gray group-hover:text-red-500" />
                            <span className="text-sm font-medium text-soft-white group-hover:text-red-500">Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary py-2 px-8 text-sm rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleTheme}
                className="p-2 text-muted-gray hover:text-primary transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative z-[70] p-2 text-soft-white hover:bg-soft-white/10 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[55] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background z-[60] md:hidden border-l border-soft-white/10 shadow-2xl flex flex-col"
            >
              {/* Menu Header */}
              <div className="p-8 flex items-center justify-between border-b border-soft-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Notebook className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-soft-white">Menu</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-gray hover:text-soft-white hover:bg-soft-white/5 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link 
                      to={link.href} 
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                        isActive(link.href) 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-gray hover:bg-soft-white/5 border border-transparent hover:border-white/5'
                      }`}
                    >
                      <span className="text-lg font-medium">{link.name}</span>
                      <ChevronRight size={20} className={isActive(link.href) ? 'opacity-100' : 'opacity-0'} />
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-8 pt-8 border-t border-soft-white/10">
                  {user ? (
                    <div className="space-y-4">
                      <Link to="/profile" className="p-4 rounded-2xl bg-soft-white/5 border border-soft-white/10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-primary" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-soft-white font-bold">{user.fullName}</p>
                          <p className="text-xs text-muted-gray">View Profile</p>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                      >
                        <LogOut size={20} />
                        Logout Session
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="btn-primary w-full py-4 text-lg text-center rounded-2xl flex items-center justify-center gap-2">
                      <User size={20} />
                      Sign In Now
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Footer text */}
              <div className="p-8 text-center border-t border-soft-white/10">
                <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">NexNote © 2024</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
