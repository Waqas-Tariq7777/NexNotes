import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

// base API URL
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Load user from localStorage on page load
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// Auth store
export const useAuthStore = create((set, get) => ({
  user: parsedUser,
  loading: false,
  isCheckingAuth: false,
  isUploading: false,

  setUser: (userData) => {
    set({ user: userData });
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  },

  // Signup user
  signupUser: async (data, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/auth/signup`, data);
      if (res.status === 201) {
        toast.success("Registration successful! Please login.");
        set({ loading: false });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
    }
  },

  // login user
  loginUser: async (credentials, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, credentials, { withCredentials: true });
      const data = res.data?.data;

      if (res.status === 200) {
        set({ user: data.user, loading: false });
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        toast.success("Login successful");
        if (onSuccess) onSuccess(data.user);
      }
    } catch (error) {
      set({ loading: false, user: null });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    }
  },

  // Google login
  loginWithGoogle: async (tokenData, onSuccess) => {
    set({ loading: true });
    try {
      const payload = tokenData.credential 
        ? { idToken: tokenData.credential } 
        : { googleAccessToken: tokenData.access_token };

      const res = await axios.post(`${baseUrl}/api/auth/google-login`, payload, { withCredentials: true });
      const data = res.data?.data;

      if (res.status === 200) {
        set({ user: data.user, loading: false });
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        toast.success("Google login successful");
        if (onSuccess) onSuccess(data.user);
      }
    } catch (error) {
      set({ loading: false, user: null });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      const message = error.response?.data?.message || "Google login failed";
      toast.error(message);
    }
  },

  // logout user
  logoutUser: async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {}, { withCredentials: true });
      set({ user: null });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.info("Logged out successfully");
    } catch (error) {
      // Even if server call fails, we clear local state
      set({ user: null });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.error("Logout error, but cleared session");
    }
  },

  // check auth status (get current user)
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(`${baseUrl}/api/auth/current-user`, { withCredentials: true });
      if (res.status === 200) {
        set({ user: res.data.data, isCheckingAuth: false });
        localStorage.setItem("user", JSON.stringify(res.data.data));
      }
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  },

  // Update profile
  updateProfile: async (formData, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`${baseUrl}/api/auth/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        const updatedUser = res.data.data;
        set({ user: updatedUser, loading: false });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
        if (onSuccess) onSuccess(updatedUser);
      }
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  },

  // Upload profile picture immediately
  uploadProfilePicture: async (file) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await axios.patch(`${baseUrl}/api/auth/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const updatedUser = res.data.data;
        set({ user: updatedUser, isUploading: false });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile picture updated successfully!");
        return updatedUser;
      }
    } catch (error) {
      set({ isUploading: false });
      const message = error.response?.data?.message || "Failed to update profile picture";
      toast.error(message);
      throw error;
    }
  }
}));
