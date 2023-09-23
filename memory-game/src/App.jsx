import React, { useState } from "react";
import Board from "./components/Board";
import useTimer from "./hooks/useTimer";
import "./styles.css";

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [timeLeft, resetTimer] = useTimer(60);

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
          <Board
            rows={difficulty[0]}
            cols={difficulty[1]}
            resetTimer={resetTimer}
          />
          <div>Time Left: {timeLeft} seconds</div>
          <button onClick={() => setDifficulty(null)}>Change Difficulty</button>
        </div>
      )}
    </div>
  );
}

export default App;
