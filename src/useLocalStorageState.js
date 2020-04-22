import { useState } from "react";

export default function useLocalStorageState(name, defaultValue = null) {
  const [state, setState] = useState(() => {
    const fromLocal = window.localStorage.getItem(name);
    if (fromLocal !== null) {
      try {
        return JSON.parse(fromLocal);
      } catch (e) {}
    }
    return defaultValue;
  });

  function setLocalStorageState(newState) {
    window.localStorage.setItem(name, JSON.stringify(newState));
    setState(newState);
  }

  function cleanupLocalStorageState() {
    window.localStorage.removeItem(name);
  }

  return [state, setLocalStorageState, cleanupLocalStorageState];
}
