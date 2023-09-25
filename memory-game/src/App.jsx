import React, { useState, useEffect, useCallback } from "react";
import Game from "./components/Game";
import useTimer from "./hooks/useTimer";
import bellImage from "/images/tacañonas.jpg";
import backgroundImage from "/images/gameplay.jpg";
import victoryImage from "/images/torrevieja.jpg";

export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [showBell, setShowBell] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const onTimeout = useCallback(() => {
    setShowGameOver(true);
    setShowBell(true);
    stopTimer();
    setTimeout(() => {
      setShowBell(false);
      setDifficulty(null);
      setShowGameOver(false);
    }, 10000);
  }, []);

  const [timeLeft, resetTimer, startTimer, stopTimer] = useTimer(60, onTimeout);

  const onVictory = useCallback(() => {
    stopTimer();
    setShowVictory(true);
    setTimeout(() => {
      setDifficulty(null);
      setShowVictory(false);
    }, 10000);
  }, [stopTimer]);

  useEffect(() => {
    if (difficulty) {
      resetTimer();
      startTimer();
      setShowBell(false);
      setShowGameOver(false);
      setShowVictory(false);
    }
  }, [difficulty, resetTimer, startTimer]);

  return (
    <div className="App">
      {!difficulty && (
        <div className="title-container">
          <h1 className="title">Cards Memory Game</h1>
        </div>
      )}
      {!difficulty ? (
        <div className="difficulty-selection-container">
          <div className="difficulty-selection">
            <h2>Select level of difficulty</h2>
            <button
              className="difficulty-button easy"
              onClick={() => setDifficulty([4, 4])}
            >
              Easy
            </button>
            <button
              className="difficulty-button medium"
              onClick={() => setDifficulty([4, 6])}
            >
              Medium
            </button>
            <button
              className="difficulty-button difficult"
              onClick={() => setDifficulty([5, 6])}
            >
              Difficult
            </button>
          </div>
        </div>
      ) : (
        <div className="game-container">
          {showGameOver && <div className="game-over-message">Game over</div>}
          <div className="game-board-container">
            <div className="game-board">
              <Game
                rows={difficulty[0]}
                cols={difficulty[1]}
                timer={{ timeLeft, resetTimer, startTimer, stopTimer }}
                onVictory={onVictory}
                onChangeDifficulty={() => setDifficulty(null)}
              />
            </div>
            {showBell && (
              <div className="bell-overlay">
                <img src={bellImage} alt="Campana" />
                <div className="bell-message-container">
                  <div className="bell-message">¡Campana y se acabó!</div>
                </div>
              </div>
            )}
            {showVictory && (
              <div className="victory-overlay">
                <div className="victory-message-container">
                  <div className="victory-message">
                    Congratulations!! ¡El apartamiento en Torrevieja!
                  </div>
                </div>
                <img src={victoryImage} alt="Torrevieja" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
