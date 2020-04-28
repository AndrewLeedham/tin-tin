import { useState, useEffect } from "react";
import useLocalStorageState from "./useLocalStorageState";

export default function useTimer(start, onTimerEnd) {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime, cleanupStorage] = useLocalStorageState("time", start);
  const [last, setLast] = useState(Date.now());
  const [alarm] = useState(() => {
    const out = new Audio(`${process.env.PUBLIC_URL}/alarm.mp3`);
    out.loop = true;
    return out;
  });
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
            alarm.play();
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
    alarm.pause();
  }

  function cleanup() {
    cleanupStorage();
    alarm.pause();
  }

  return [time, isPaused, setIsPaused, reset, cleanup];
}
