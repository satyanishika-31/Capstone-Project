import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "../config/api";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  
  // Initialize auth state from localStorage
  initializeAuth: async () => {
    try {
      set((state) => ({ ...state, loading: true }));
      const savedUser = localStorage.getItem("currentUser");
      
      if (savedUser) {
        const user = JSON.parse(savedUser);
        set({
          currentUser: user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error("Failed to initialize auth:", err);
      localStorage.removeItem("currentUser");
      set({ loading: false });
    }
  },

  login: async (userCred) => {
    try {
      set((stat) => ({ ...stat, loading: true }));
      let res = await axios.post(`${API_BASE_URL}/auth/login`, userCred, { withCredentials: true });
      const loggedInUser = res.data?.payload || res.data?.user || res.data;
      
      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      
      set((stat) => ({
        ...stat,
        loading: false,
        isAuthenticated: true,
        currentUser: loggedInUser,
        error: null,
      }));
    } catch (err) {
      console.log("err is ", err);
      localStorage.removeItem("currentUser");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set((state) => ({ ...state, loading: true, error: null }));
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      
      // Clear localStorage
      localStorage.removeItem("currentUser");
      
      set({
        currentUser: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      localStorage.removeItem("currentUser");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },
}));