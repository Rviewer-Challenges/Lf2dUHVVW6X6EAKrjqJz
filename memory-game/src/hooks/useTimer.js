import { useState, useEffect } from "react";

export default function useTimer(initialTime = 0, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log("useEffect is running, isActive:", isActive);  
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
  }, [initialTime, onTimeout, isActive]);

  function resetTimer() {
    setTimeLeft(initialTime);
    setIsActive(false);
  }

  function stopTimer() {
    setIsActive(false);
  }

  function startTimer() {
    setIsActive(true);
  }


  return [timeLeft, resetTimer, startTimer, stopTimer, isActive];
}
