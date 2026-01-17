import { useEffect, useRef } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {}

export function useIntersection<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  options?: UseIntersectionOptions
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, {
      rootMargin: "100px",
      ...options
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return ref;
}