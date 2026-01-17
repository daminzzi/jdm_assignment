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

      setAuth: (token, user) => {
        // role을 쿠키에 저장
        if (typeof document !== "undefined") {
          document.cookie = `role=${user.role}; path=/; max-age=86400`;
        }
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
          role: user.role === "STUDENT" ? "student" : "instructor",
        });
      },

      logout: () => {
        // 로그아웃 시 쿠키 삭제
        if (typeof document !== "undefined") {
          document.cookie = "role=; path=/; max-age=0";
        }
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          role: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
