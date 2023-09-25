import React from "react";

export default function GameStats({
  timeLeft,
  moves,
  matchedPairs,
  totalPairs,
}) {
  return (
    <div>
      <div data-testid="timeLeft">Time Left: {timeLeft} seconds</div>
      <div data-testid="moves">Moves: {moves}</div>
      <div data-testid="matched">Matched Pairs: {matchedPairs}</div>
      <div data-testid="remaining">Remaining Pairs: {totalPairs - matchedPairs}</div>
    </div>
  );
}
