import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CourseSelectState {
  selectedCourseIds: number[];
  toggle: (id: number) => void;
  clear: () => void;
}

export const useCourseSelect = create<CourseSelectState>()(
  persist(
    (set) => ({
      selectedCourseIds: [],

      toggle: (id: number) =>
        set((state) => ({
          selectedCourseIds: state.selectedCourseIds.includes(id)
            ? state.selectedCourseIds.filter((x) => x !== id)
            : [...state.selectedCourseIds, id],
        })),

      clear: () => set({ selectedCourseIds: [] }),
    }),
    {
      name: "course-select-storage",
    }
  )
);
