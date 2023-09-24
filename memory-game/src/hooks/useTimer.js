import { useState, useEffect, useCallback } from "react";

export default function useTimer(initialTime = 0, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            if (onTimeout) {
              setIsActive(false);
              onTimeout();
            }
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [onTimeout, isActive]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  return [timeLeft, resetTimer, startTimer, stopTimer, isActive];
}
