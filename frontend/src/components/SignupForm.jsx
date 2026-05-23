import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { signupUser, loginWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginWithGoogle(tokenResponse, () => {
        navigate('/');
      });
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  const validate = (name, value) => {
    let error = "";
    if (name === "fullName") {
      if (!value.trim()) error = "Full name is required";
      else if (value.trim().length < 2) error = "Name must be at least 2 characters";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Invalid email format";
    }
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Must be at least 8 characters";
      else if (!passwordRegex.test(value)) error = "Must include uppercase, lowercase, and number";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validate(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ fullName: true, email: true, password: true });
      toast.error("Please fix the errors in the form");
      return;
    }

    await signupUser(formData, () => {
      navigate('/login');
    });
  };

  const getInputClass = (name) => {
    const baseClass = "w-full bg-soft-white/5 border rounded-2xl py-2.5 sm:py-3 pl-12 pr-4 text-soft-white placeholder:text-muted-gray focus:outline-none transition-all duration-300 shadow-inner";
    if (touched[name] && errors[name]) return `${baseClass} border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500`;
    if (touched[name] && !errors[name] && formData[name]) return `${baseClass} border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`;
    return `${baseClass} border-soft-white/10 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/30`;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-soft-white mb-1">Sign Up</h2>
        <p className="text-muted-gray text-sm sm:text-base">Create your future in notes.</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-muted-gray">Full Name</label>
            <AnimatePresence>
              {touched.fullName && errors.fullName && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.fullName}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative group">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${touched.fullName && errors.fullName ? 'text-red-400' : 'text-muted-gray group-focus-within:text-secondary'}`} size={20} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={getInputClass('fullName')}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-muted-gray">Email Address</label>
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative group">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${touched.email && errors.email ? 'text-red-400' : 'text-muted-gray group-focus-within:text-secondary'}`} size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="name@example.com"
              className={getInputClass('email')}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-muted-gray">Password</label>
            <AnimatePresence>
              {touched.password && errors.password && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.password}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative group">
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${touched.password && errors.password ? 'text-red-400' : 'text-muted-gray group-focus-within:text-secondary'}`} size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Num"
              className={getInputClass('password')}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 px-1 py-1 group cursor-pointer">
          <input type="checkbox" required className="mt-1 accent-secondary w-4 h-4 cursor-pointer" id="terms" />
          <label htmlFor="terms" className="text-xs text-muted-gray cursor-pointer group-hover:text-soft-white transition-colors">
            I agree to the <a href="#" className="text-secondary hover:text-soft-white transition-all">Terms of Service</a> and <a href="#" className="text-secondary hover:text-soft-white transition-all">Privacy Policy</a>.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-secondary py-2.5 sm:py-3 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
          <span>{loading ? "Creating Account..." : "Create Account"}</span>
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-muted-gray text-sm">
          Already have an account? <Link to="/login" className="text-secondary font-bold hover:text-soft-white transition-all">Log in</Link>
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[1px] flex-grow bg-soft-white/10" />
          <span className="text-[10px] text-muted-gray uppercase tracking-[0.2em] font-bold">Or sign up with</span>
          <div className="h-[1px] flex-grow bg-soft-white/10" />
        </div>
        
        <button 
          type="button"
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full btn-rgb group flex items-center justify-center gap-4 py-2.5 sm:py-3 px-6 transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center justify-center bg-white rounded-full p-1 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white dark:text-soft-white group-hover:text-secondary transition-colors duration-300">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
