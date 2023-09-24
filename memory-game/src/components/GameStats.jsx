import React from "react";

export default function GameStats({
  timeLeft,
  moves,
  matchedPairs,
  totalPairs,
}) {
  return (
    <div>
      <div>Time Left: {timeLeft} seconds</div>
      <div>Moves: {moves}</div>
      <div>Matched Pairs: {matchedPairs}</div>
      <div>Remaining Pairs: {totalPairs - matchedPairs}</div>
    </div>
  );
}
