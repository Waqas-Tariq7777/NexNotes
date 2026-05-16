import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { loginUser, loginWithGoogle, loading } = useAuthStore();
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
    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Invalid email format";
      }
    }
    if (name === "password") {
      if (!value) error = "Password is required";
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
      setTouched({ email: true, password: true });
      toast.error("Please enter valid credentials");
      return;
    }

    await loginUser(formData, () => {
      navigate('/');
    });
  };

  const getInputClass = (name) => {
    const baseClass = "w-full bg-soft-white/5 border rounded-2xl py-4 pl-12 pr-4 text-soft-white placeholder:text-muted-gray focus:outline-none transition-all duration-300 shadow-inner";
    if (touched[name] && errors[name]) return `${baseClass} border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500`;
    return `${baseClass} border-soft-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary/30`;
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-soft-white mb-3">Login</h2>
        <p className="text-muted-gray text-lg">Glad to have you back!</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
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
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${touched.email && errors.email ? 'text-red-400' : 'text-muted-gray group-focus-within:text-primary'}`} size={20} />
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

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-muted-gray">Password</label>
            <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:text-soft-white transition-all">Forgot password?</Link>
          </div>
          <div className="relative group">
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${touched.password && errors.password ? 'text-red-400' : 'text-muted-gray group-focus-within:text-primary'}`} size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className={getInputClass('password')}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
          <span>{loading ? "Signing In..." : "Sign In"}</span>
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-muted-gray">
          New here? <Link to="/signup" className="text-primary font-bold hover:text-soft-white transition-all">Create an account</Link>
        </p>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-grow bg-soft-white/10" />
          <span className="text-[10px] text-muted-gray uppercase tracking-[0.2em] font-bold">Or continue with</span>
          <div className="h-[1px] flex-grow bg-soft-white/10" />
        </div>
        
        <button 
          type="button"
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full btn-rgb group flex items-center justify-center gap-4 py-4 px-6 transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center justify-center bg-white rounded-full p-1 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          </div>
          <span className="text-lg font-bold text-white dark:text-soft-white group-hover:text-primary transition-colors duration-300">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
