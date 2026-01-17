import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "student" | "instructor";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
}

type AuthState = {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;

  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),

      setAuth: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
          role: user.role === "STUDENT" ? "student" : "instructor",
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          role: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
