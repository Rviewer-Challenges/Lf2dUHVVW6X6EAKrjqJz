import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function Board({ rows, cols, resetTimer }) {

  if (rows <= 0 || cols <= 0) {
    throw new Error(
      "A negative or zero board size? That's possible only in the multiverse!"
    );
  }

  const [board, setBoard] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setBoard(createBoard(rows, cols));
  }, [rows, cols]);

  useEffect(() => {
    if (matchedCards.length === (rows * cols) / 2) {
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
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          flippedCards.forEach(({ rowIndex, colIndex }) => {
            newBoard[rowIndex][colIndex].isFlipped = false;
          });
          return newBoard;
        });

        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  function createBoard(rows, cols) {
    const totalCards = rows * cols;

    const cardData = [];

    for (let i = 0; i < totalCards / 2; i++) {
      for (let j = 0; j < 2; j++) {
        cardData.push([i + "-" + j]);
      }
    }

    const shuffledCards = [...cardData];

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
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[rowIndex][colIndex].isFlipped = true;
        return newBoard;
      });

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
            cardIndex={colIndex + rowIndex * cols}
          />
        ))
      )}

      <div>Moves: {moves}</div>
    </div>
  );
}
