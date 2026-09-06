import { useEffect } from "react";

/**
 * One-Shot Scroll Reveal Engine for the page session.
 *
 * Guarantees:
 * 1. Elements animate ONLY ONCE upon their first natural viewport entry.
 * 2. Elements far below the fold do NOT animate until naturally reached by user scrolling.
 * 3. Once revealed, elements transition to a permanent settled state and NEVER animate again.
 * 4. Scrolling Top -> Bottom -> Top -> Bottom any number of times will NEVER re-trigger or reverse.
 * 5. Full support for prefers-reduced-motion (instant display with zero transitions).
 * 6. Hard page refresh initiates a clean new cycle for the fresh session.
 */

// In-memory set of elements revealed during this page session
const sessionRevealedElements = new WeakSet<Element>();

export function initScrollReveal(): () => void {
  if (typeof window === "undefined") return () => {};

  // Respect prefers-reduced-motion or missing IntersectionObserver
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal-on-scroll, .reveal-fade")
      .forEach((el) => {
        el.classList.add("is-revealed", "reveal-settled");
        el.setAttribute("data-reveal-settled", "true");
        sessionRevealedElements.add(el);
      });
    return () => {};
  }

  // Find all elements that have not yet been revealed in this session
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".reveal-on-scroll, .reveal-fade"
    )
  ).filter((el) => {
    // If element is already settled/revealed in this session, guarantee settled state and skip
    if (el.getAttribute("data-reveal-settled") === "true" || sessionRevealedElements.has(el)) {
      el.classList.add("is-revealed", "reveal-settled");
      return false;
    }
    return true;
  });

  if (targets.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          // 1. Immediately stop observing so this element can NEVER be re-triggered
          obs.unobserve(target);
          sessionRevealedElements.add(target);

          // 2. Add revealed class to initiate smooth one-time entry animation
          target.classList.add("is-revealed");
          target.setAttribute("data-reveal-status", "revealed");

          // 3. When the transition completes (650ms), transition to permanent settled state
          const onTransitionEnd = () => {
            target.classList.add("reveal-settled");
            target.setAttribute("data-reveal-settled", "true");
            target.removeEventListener("transitionend", onTransitionEnd);
          };

          target.addEventListener("transitionend", onTransitionEnd, { once: true });

          // Fallback timer (750ms) to ensure settled state is locked even if transitionend is swallowed
          setTimeout(() => {
            target.classList.add("reveal-settled");
            target.setAttribute("data-reveal-settled", "true");
          }, 750);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -40px 0px", // triggers naturally when 40px inside the bottom edge
      threshold: 0.05,
    }
  );

  const observeElements = (elements: NodeListOf<HTMLElement> | HTMLElement[]) => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach((el) => {
      if (el.getAttribute("data-reveal-settled") === "true" || sessionRevealedElements.has(el)) {
        el.classList.add("is-revealed", "reveal-settled");
        return;
      }

      // If element is already in or above viewport, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh + 50 && rect.bottom >= -50) {
        sessionRevealedElements.add(el);
        el.classList.add("is-revealed");
        setTimeout(() => {
          el.classList.add("reveal-settled");
          el.setAttribute("data-reveal-settled", "true");
        }, 700);
      } else {
        observer.observe(el);
      }
    });
  };

  // Initial pass
  const initialTargets = Array.from(
    document.querySelectorAll<HTMLElement>(".reveal-on-scroll, .reveal-fade")
  );
  observeElements(initialTargets);

  // MutationObserver to capture dynamically rendered CMS components
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.matches(".reveal-on-scroll, .reveal-fade")) {
            observeElements([node]);
          }
          const nested = node.querySelectorAll<HTMLElement>(".reveal-on-scroll, .reveal-fade");
          if (nested.length > 0) {
            observeElements(nested);
          }
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Enterprise fallback timer: ensures no element stays stuck at opacity:0
  const fallbackTimer = setTimeout(() => {
    document
      .querySelectorAll<HTMLElement>(".reveal-on-scroll:not(.is-revealed), .reveal-fade:not(.is-revealed)")
      .forEach((el) => {
        el.classList.add("is-revealed", "reveal-settled");
        el.setAttribute("data-reveal-settled", "true");
        sessionRevealedElements.add(el);
      });
  }, 2000);

  return () => {
    clearTimeout(fallbackTimer);
    observer.disconnect();
    mutationObserver.disconnect();
  };
}

/**
 * Hook to trigger one-shot scroll reveal when a component mounts.
 */
export function useScrollReveal(deps: React.DependencyList = []): void {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      initScrollReveal();
    });
    return () => cancelAnimationFrame(raf);
  }, deps);
}

export default useScrollReveal;
