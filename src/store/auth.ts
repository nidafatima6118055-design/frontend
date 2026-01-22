// src/store/auth.ts
import { create } from "zustand";
import Cookies from "js-cookie";

import api from "../lib/api/axiosClient";


type User = {
    id: number;
    email: string;
    username: string;
    tenant_id: number;
    role: string;
};

interface AuthState {
    user: any;
    hydrated: boolean;
    loginSource: string | null;
    isLoggedin: boolean;
    _hydrating?: boolean;
    access: string | null;
    /** 🧠 Getters */
    getUser: () => any;
    getIsLoggedIn: () => boolean;
  
    /** ⚙️ Actions */
    setAuth: (user: any, source?: string | null) => void;
    clearAuth: () => void;
    hydrateUser: (force?: boolean) => Promise<void>;
    logoutUser: () => Promise<void>;
    setAccess: (token: string | null) => void;
}



/* ---------------------------------------------
   🔐 Auth Store — Handles user session, cookies,
   and hydration logic (Zustand + Cookies)
---------------------------------------------- */



export const useAuthStore = create<AuthState>((set, get) => ({
    /** 🌱 State */
    user: null,
    hydrated: false,
    loginSource: null,
    isLoggedin: false,
    _hydrating: false,
    access: null,
  
    /** 🧠 Getters */
    getUser: () => get().user,
    getIsLoggedIn: () => get().isLoggedin,
  
    /** ✅ Save user to state and cookies */
    setAuth: (user, source = null) => {
      set({
        user,
        hydrated: true,
        loginSource: source,
        isLoggedin: true,
      });
  
      // Optionally persist cookies
      // Cookies.set("user", JSON.stringify(user), { sameSite: "Lax", path: "/" });
      // Cookies.set("role", user.role, { sameSite: "Lax", path: "/" });
  
      console.log("🔐 Auth user set:", user);
    },

    /** 🔑 Set access token */
    setAccess: (token) => {
      set({ access: token });
      if (token) {
        Cookies.set("access", token, { sameSite: "Lax", path: "/" });
      } else {
        Cookies.remove("access", { path: "/" });
      }
    },
  
    /** 🧹 Clear all auth-related state and cookies */
    clearAuth: () => {
      set({
        user: null,
        hydrated: true,
        loginSource: null,
        isLoggedin: false,
      });
  
      const opts = { path: "/" };
      ["user", "role", "access", "refresh"].forEach((k) => Cookies.remove(k, opts));
  
      console.log("🚪 Auth cleared.");
    },
  
    /** 🪄 Hydrate user from cookie or backend `/me/` endpoint */
    hydrateUser: async (force = false) => {
      if (get().hydrated && !force) return;
      if (get()._hydrating) return; // prevent concurrent hydrations
  
      set({ _hydrating: true });
  
      const hasSession =
        Cookies.get("access") || Cookies.get("refresh") || Cookies.get("user");
  
      if (!hasSession) {
        console.log("ℹ️ No auth cookies found — skipping /me request.");
        set({ user: null, hydrated: true, isLoggedin: false, _hydrating: false });
        return;
      }
  
      try {
        const res = await api.get("/api/auth/me/");
        const user = res.data?.data?.user;
  
        if (user) {
          set({ user, hydrated: true, isLoggedin: true, _hydrating: false });
          Cookies.set("user", JSON.stringify(user), { sameSite: "Lax", path: "/" });
          Cookies.set("role", user.role, { sameSite: "Lax", path: "/" });
          console.log("✅ User hydrated from /me/");
          return;
        }
  
        // No user returned
        set({ user: null, hydrated: true, isLoggedin: false, _hydrating: false });
      } catch (err: any) {
        console.warn("⚠️ Auth hydration failed:", err?.response?.data || err);
        const opts = { path: "/" };
        ["user", "role", "access", "refresh"].forEach((k) => Cookies.remove(k, opts));
        set({ user: null, hydrated: true, isLoggedin: false, _hydrating: false });
      }
    },
  
    /** 🚪 Logout — Call backend, then clear client state */
    logoutUser: async () => {
      try {
        console.log("🔒 Logging out...");
        await api.post("/api/auth/logout/", {}, { withCredentials: true });
      } catch (err) {
        console.warn("⚠️ Logout API failed (non-fatal):", err);
      } finally {
        const opts = { path: "/" };
        ["user", "role", "access", "refresh"].forEach((k) => Cookies.remove(k, opts));
        set({ user: null, hydrated: true, isLoggedin: false });
  
        // Optional redirect
        // if (typeof window !== "undefined") window.location.href = "/signin";
        console.log("✅ Client cleanup done.");
      }
    },
    
}));