import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Camera, Loader2, Save, X, Lock, ShieldCheck, CheckCircle2, Pencil, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, uploadProfilePicture, loading, isUploading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [user]);

  if (!user) return null;

  const validate = () => {
    const newErrors = {};
    
    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Minimum 2 characters required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(formData.newPassword)) {
        newErrors.newPassword = "Must contain 1 uppercase, 1 lowercase, and 1 number";
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Immediate Profile Picture Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      // Real-time preview before upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Trigger immediate upload
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        // Reset preview on failure
        setPreviewImage(user.profilePicture || null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the validation errors");
      return;
    }

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    
    if (formData.newPassword) {
      data.append('currentPassword', formData.currentPassword);
      data.append('newPassword', formData.newPassword);
    }

    await updateProfile(data, () => {
      setIsEditing(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
    });
    setPreviewImage(user.profilePicture || null);
    setErrors({});
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Panel - Identity Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="glass-card p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
              
              <div className="relative group mb-8">
                <div className={`w-36 h-36 rounded-full bg-primary/10 border-2 transition-all duration-500 flex items-center justify-center overflow-hidden relative shadow-inner ${isUploading ? 'border-primary animate-pulse' : 'border-primary/20'}`}>
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'scale-110 blur-sm opacity-50' : 'group-hover:scale-110'}`} />
                  ) : (
                    <User size={80} className="text-primary/40" />
                  )}
                  
                  {/* Uploading Spinner Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
                      <Loader2 className="text-primary animate-spin" size={40} />
                    </div>
                  )}

                  {/* Manual trigger for the file input */}
                  <div 
                    onClick={() => !isUploading && fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px] z-10"
                  >
                    <Camera className="text-white mb-1" size={28} />
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change Photo</span>
                  </div>
                </div>

                {/* Pencil Icon Button */}
                <button 
                  onClick={() => !isUploading && fileInputRef.current.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-rich-black shadow-lg shadow-primary/40 hover:scale-110 active:scale-95 transition-all z-30 border-4 border-background disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Update Profile Picture"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Pencil size={18} />}
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                  disabled={isUploading}
                />
              </div>
              
              <h2 className="text-3xl font-bold text-soft-white mb-2">{user.fullName}</h2>
              <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-8">
                <ShieldCheck size={14} />
                Verified Account
              </div>
              
              <div className="w-full space-y-4 pt-8 border-t border-soft-white/10 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-gray">Account Status</span>
                  <span className="text-emerald-500 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-gray">Member Since</span>
                  <span className="text-soft-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3 text-primary mb-3">
                <CheckCircle2 size={22} />
                <h4 className="font-bold">Pro Account Info</h4>
              </div>
              <p className="text-sm text-muted-gray leading-relaxed">
                You are currently on the basic plan. Upgrade to unlock unlimited note storage and AI features.
              </p>
            </div>
          </div>

          {/* Right Panel - Settings Form */}
          <div className="w-full lg:w-2/3">
            <div className="glass-card p-8 md:p-12 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Edit2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-soft-white">Account Settings</h3>
                    <p className="text-muted-gray text-sm">Manage your profile and security</p>
                  </div>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn-primary py-2.5 px-6 text-sm rounded-xl flex items-center gap-2 shadow-lg"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-muted-gray uppercase tracking-wider">Full Name</label>
                      {errors.fullName && <span className="text-[10px] text-red-500 font-bold">{errors.fullName}</span>}
                    </div>
                    <div className="relative group">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-primary' : 'text-muted-gray'}`} size={20} />
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`glass-input pl-12 h-14 ${!isEditing ? 'opacity-60 cursor-not-allowed border-transparent bg-transparent shadow-none' : 'border-primary/20'}`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-muted-gray uppercase tracking-wider">Email Address</label>
                      {errors.email && <span className="text-[10px] text-red-500 font-bold">{errors.email}</span>}
                    </div>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-primary' : 'text-muted-gray'}`} size={20} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`glass-input pl-12 h-14 ${!isEditing ? 'opacity-60 cursor-not-allowed border-transparent bg-transparent shadow-none' : 'border-primary/20'}`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="pt-10 border-t border-soft-white/10 space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Lock size={18} />
                        </div>
                        <h4 className="text-lg font-bold text-soft-white">Security Update</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-muted-gray uppercase tracking-wider">Current Password</label>
                            {errors.currentPassword && <span className="text-[10px] text-red-500 font-bold">{errors.currentPassword}</span>}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-gray" size={20} />
                            <input 
                              type="password" 
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="glass-input pl-12 h-14 border-primary/20"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-muted-gray uppercase tracking-wider">New Password</label>
                            {errors.newPassword && <span className="text-[10px] text-red-500 font-bold">{errors.newPassword}</span>}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-gray" size={20} />
                            <input 
                              type="password" 
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="glass-input pl-12 h-14 border-primary/20"
                              placeholder="••••••••"
                            />
                          </div>
                          
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isEditing ? (
                  <div className="flex items-center gap-4 pt-10">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary flex-1 py-4 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                    >
                      {loading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                      <span className="text-lg">Save Profile</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancel}
                      className="px-10 py-4 rounded-2xl border border-soft-white/10 text-muted-gray hover:bg-soft-white/5 hover:text-soft-white transition-all flex items-center gap-2 font-bold"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="pt-10 border-t border-soft-white/10">
                    <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-soft-white font-bold mb-1 text-lg">Privacy Guaranteed</h4>
                        <p className="text-sm text-muted-gray leading-relaxed">
                          Your profile data is encrypted. We ensure that your information remains private and is only accessible by you.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
