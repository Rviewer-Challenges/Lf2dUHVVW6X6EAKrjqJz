import React, { useEffect } from "react";
import Card from "./Card";

export default function Board({ board, handleCardClick, flippedCards }) {
  useEffect(() => {}, [board]);

  if (!board || board.length === 0) {
    return <div>Loading...</div>;
  }

  const rows = board.length;
  const cols = board[0].length;

  return (
    <div
      className="board"
      data-testid="board"
      style={{ gridTemplateColumns: `repeat(${cols}, 100px)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((card, colIndex) => (
          <Card
            key={`${rowIndex}-${colIndex}`}
            card={card}
            onClick={() => handleCardClick(card, rowIndex, colIndex)}
            isFlipping={flippedCards.some((fc) => fc.id === card.id)}
          />
        ))
      )}
    </div>
  );
}
