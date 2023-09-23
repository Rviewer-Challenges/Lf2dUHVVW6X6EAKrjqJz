import { useState, useEffect } from "react";

export default function useTimer(initialTime = 0, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);

          if (onTimeout) {
            console.log("onTimeout called");
            onTimeout();
          }

          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onTimeout]);

  function resetTimer() {
    setTimeLeft(initialTime);
  }

  return [timeLeft, resetTimer];
}
