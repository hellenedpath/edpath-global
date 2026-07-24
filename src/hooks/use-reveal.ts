import { useEffect } from "react";

/**
 * Fail-safe reveal: content is always visible (CSS default opacity 1).
 * This hook simply marks [data-reveal] elements as "in" — immediately,
 * again after ~100ms, and for any nodes added later (async data, filters).
 */
export function useReveal() {
  useEffect(() => {
    const markAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal='in'])")
        .forEach((el) => el.setAttribute("data-reveal", "in"));
    };
    markAll();
    const t = window.setTimeout(markAll, 100);

    const mo = new MutationObserver(() => markAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t);
      mo.disconnect();
    };
  }, []);
}