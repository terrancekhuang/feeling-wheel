import { useEffect, useState } from "react";

// ponytail: 15-line router for a handful of flat paths; swap for a library if routes get nested.
export function usePath() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const update = () => setPath(location.pathname);
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  return path;
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
