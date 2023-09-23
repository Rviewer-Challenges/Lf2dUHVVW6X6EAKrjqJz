import { useState, useEffect } from "react";

export default function useTimer(initialTime = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);

          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function resetTimer() {
    setTimeLeft(initialTime);
  }

  return [timeLeft, resetTimer];
}
