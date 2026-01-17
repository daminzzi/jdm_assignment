import { create } from "zustand";

export type UserRole = "student" | "instructor";

type AuthState = {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  clearRole: () => set({ role: null }),
}));
