import { create } from "zustand";
import { EnrollResult } from "@/entities/enrollment";

interface EnrollState {
  lastEnrollResult: EnrollResult | null;
  setEnrollResult: (result: EnrollResult) => void;
  clearEnrollResult: () => void;
}

export const useEnrollStore = create<EnrollState>((set) => ({
  lastEnrollResult: null,
  setEnrollResult: (result) => set({ lastEnrollResult: result }),
  clearEnrollResult: () => set({ lastEnrollResult: null }),
}));
