import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EnrollResult } from "@/entities/enrollment";

interface EnrollState {
  lastEnrollResult: EnrollResult | null;
  setEnrollResult: (result: EnrollResult) => void;
  clearEnrollResult: () => void;
}

export const useEnrollStore = create<EnrollState>()(
  persist(
    (set) => ({
      lastEnrollResult: null,
      setEnrollResult: (result) => set({ lastEnrollResult: result }),
      clearEnrollResult: () => set({ lastEnrollResult: null }),
    }),
    {
      name: "enroll-result-storage",
    }
  )
);
