import { useEffect, useState } from "react";

// ponytail: 15-line router for a handful of flat paths; swap for a library if routes get nested.
// Returns the path plus a counter that bumps on every navigation, even to the same path
// (key a component on it to start fresh, e.g. the wheel when the header link is clicked).
export function usePath() {
  const [nav, setNav] = useState({ path: location.pathname, n: 0 });
  useEffect(() => {
    const update = () => setNav((s) => ({ path: location.pathname, n: s.n + 1 }));
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  return nav;
}

export function navigate(to: string, state: unknown = null) {
  history.pushState(state, "", to);
  dispatchEvent(new PopStateEvent("popstate"));
  scrollTo(0, 0);
}

/** Click handler for <a href>: client-side navigation unless the user is opening a new tab. */
export function linkTo(to: string, state: unknown = null) {
  return (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to, state);
  };
}
