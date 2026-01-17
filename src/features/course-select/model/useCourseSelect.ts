import { create } from "zustand";

interface CourseSelectState {
  selectedCourseIds: number[];
  toggle: (id: number) => void;
  clear: () => void;
}

export const useCourseSelect = create<CourseSelectState>((set) => ({
  selectedCourseIds: [],

  toggle: (id: number) =>
    set((state) => ({
      selectedCourseIds: state.selectedCourseIds.includes(id)
        ? state.selectedCourseIds.filter((x) => x !== id)
        : [...state.selectedCourseIds, id],
    })),

  clear: () => set({ selectedCourseIds: [] }),
}));
