import { useState, useEffect, useCallback } from "react";

export default function useTimer(initialTime = 0, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
  }, [initialTime]);

  const stopTimer = useCallback(() => setIsActive(false), []);

  const startTimer = useCallback(() => setIsActive(true), []);

  useEffect(() => {
    if (timeLeft === 0 && onTimeout) {
      setIsActive(false);
      onTimeout();
    }
  }, [timeLeft, onTimeout]);

  return [timeLeft, resetTimer, startTimer, stopTimer, isActive];
}