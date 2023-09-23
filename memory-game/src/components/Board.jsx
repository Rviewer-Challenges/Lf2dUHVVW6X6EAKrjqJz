import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function Board({ rows, cols, resetTimer }) {
  const [board, setBoard] = useState(createBoard(rows, cols));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (matchedCards.length === rows * cols) {
      resetTimer();
    }
  }, [matchedCards, resetTimer, rows, cols]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (
        firstCard.id === secondCard.id &&
        (firstCard.rowIndex !== secondCard.rowIndex ||
          firstCard.colIndex !== secondCard.colIndex)
      ) {
        setMatchedCards((prevMatched) => [...prevMatched, secondCard.id]);
      }

      setTimeout(() => {
        const newBoard = [...board];
        flippedCards.forEach(({ rowIndex, colIndex }) => {
          newBoard[rowIndex][colIndex].isFlipped = false;
        });

        setBoard(newBoard);
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  function createBoard(rows, cols) {
    const totalCards = rows * cols;
    const pairs = totalCards / 2;
    const cardData = Array.from({ length: pairs }, (_, i) => i).flatMap((i) => [
      i,
      i,
    ]);
    const shuffledCards = cardData.sort(() => Math.random() - 0.5);

    const board = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => {
        const index = rowIndex * cols + colIndex;
        return { id: shuffledCards[index], isFlipped: false };
      })
    );

    return board;
  }

  function handleCardClick(clickedCard, rowIndex, colIndex) {
    if (flippedCards.length < 2 && !clickedCard.isFlipped) {
      const newBoard = [...board];
      newBoard[rowIndex][colIndex].isFlipped = true;
      setBoard(newBoard);

      setFlippedCards((prevFlipped) => [
        ...prevFlipped,
        { ...clickedCard, rowIndex, colIndex },
      ]);
    }
  }

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, 100px)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((card, colIndex) => (
          <Card
            key={`${rowIndex}-${colIndex}`}
            card={card}
            isMatched={matchedCards.includes(card.id)}
            onClick={() => handleCardClick(card, rowIndex, colIndex)}
          />
        ))
      )}
      <div>Moves: {moves}</div>
    </div>
  );
}
