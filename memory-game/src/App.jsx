import React, { useState, useEffect, useCallback } from "react";
import Game from "./components/Game";
import useTimer from "./hooks/useTimer";
import "./styles.css";

function App() {
  const [difficulty, setDifficulty] = useState(null);

  const onTimeout = useCallback(() => {
    setDifficulty(null);
    alert("¡Campana y se acabó!");
  }, []);
  const [timeLeft, resetTimer, startTimer, stopTimer] = useTimer(60, onTimeout);

  const onVictory = useCallback(() => {
    stopTimer();
    setTimeout(() => {
      alert("¡Enhorabuena, has emparejado todas las parejas!");
    }, 0);
  }, [stopTimer]);

  useEffect(() => {
    if (difficulty) {
      resetTimer();
      startTimer();
    }
  }, [difficulty, resetTimer, startTimer]);

  return (
    <div className="App">
      {!difficulty ? (
        <div>
          <button onClick={() => setDifficulty([4, 4])}>Easy</button>
          <button onClick={() => setDifficulty([4, 6])}>Medium</button>
          <button onClick={() => setDifficulty([5, 6])}>Difficult</button>
        </div>
      ) : (
        <div>
          <Game
            rows={difficulty[0]}
            cols={difficulty[1]}
            timer={{ timeLeft, resetTimer, startTimer, stopTimer }}
            onVictory={onVictory}
          />
          <button onClick={() => setDifficulty(null)}>Change Difficulty</button>
        </div>
      )}
    </div>
  );
}

export default App;
