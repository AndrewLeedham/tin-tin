import { useState, useEffect } from "react";
import useLocalStorageState from "./useLocalStorageState";

export default function useTimer(start, onTimerEnd) {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime, cleanup] = useLocalStorageState("time", start);
  const [last, setLast] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused !== true) {
        const current = Date.now();
        const delta = current - last;
        if (delta >= 1000) {
          if (time - 1 > 0) {
            setTime(time - 1);
          } else {
            setTime(0);
            setIsPaused(true);
            onTimerEnd && onTimerEnd();
          }
        } else {
          setLast(current);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  function reset() {
    setTime(start);
    setLast(Date.now());
  }

  return [time, isPaused, setIsPaused, reset, cleanup];
}
