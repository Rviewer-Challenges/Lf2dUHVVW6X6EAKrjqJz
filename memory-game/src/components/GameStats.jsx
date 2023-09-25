import React from "react";

export default function GameStats({
  timeLeft,
  moves,
  matchedPairs,
  totalPairs,
  onChangeDifficulty, // Nueva prop para manejar el cambio de dificultad
}) {
  return (
    <div className="game-stats">
      <div data-testid="timeLeft">Time Left: {timeLeft} seconds</div>
      <div data-testid="moves">Moves: {moves}</div>
      <div data-testid="matched">Matched Pairs: {matchedPairs}</div>
      <div data-testid="remaining">
        Remaining Pairs: {totalPairs - matchedPairs}
      </div>
      <button className="button" onClick={onChangeDifficulty}>
        Change Difficulty
      </button>{" "}
    </div>
  );
}
