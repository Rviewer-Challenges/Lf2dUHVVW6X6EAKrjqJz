import { useState, useEffect } from "react";

export default function useTimer(initialTime = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function resetTimer() {
    setTimeLeft(initialTime);
  }

  return [timeLeft, resetTimer];
}
