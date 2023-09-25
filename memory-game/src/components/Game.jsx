import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import GameStats from "./GameStats";

export default function Game({ rows, cols, timer, onVictory }) {
  if (rows <= 0 || cols <= 0) {
    throw new Error(
      "A negative or zero board size? That's possible only in the multiverse!"
    );
  }

  const isBoardDisabledRef = useRef(false);

  const { timeLeft, resetTimer, startTimer, stopTimer, isActive } = timer;
  const [isBoardDisabled, setIsBoardDisabled] = useState(false);
  const [board, setBoard] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const totalPairs = (rows * cols) / 2;

  useEffect(() => {
    isBoardDisabledRef.current = isBoardDisabled;
  }, [isBoardDisabled]);

  useEffect(() => {
    setBoard(createBoard(rows, cols));
  }, [rows, cols]);

  useEffect(() => {
    if (matchedCards.length === rows * cols) {
      onVictory();
    }
  }, [matchedCards, onVictory, rows, cols]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsBoardDisabled(true); // Desactivar clics en el tablero
      setMoves((prevMoves) => prevMoves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (getMatchId(firstCard.id) !== getMatchId(secondCard.id)) {
        // Las tarjetas no coinciden
        setTimeout(() => {
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            flippedCards.forEach(({ rowIndex, colIndex }) => {
              newBoard[rowIndex][colIndex].isFlipped = false;
            });
            return newBoard;
          });
          setFlippedCards([]); // Limpiar tarjetas volteadas
          setIsBoardDisabled(false); // Re-activar clics en el tablero
        }, 1000);
      } else {
        // Las tarjetas coinciden
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          flippedCards.forEach(({ rowIndex, colIndex }) => {
            newBoard[rowIndex][colIndex].isMatched = true;
          });
          return newBoard;
        });
        setFlippedCards([]); // Limpiar tarjetas volteadas
        setIsBoardDisabled(false); // Re-activar clics en el tablero
      }
    }
  }, [flippedCards]);

  function createBoard(rows, cols) {
    const totalCards = rows * cols;
    const cardData = [];

    for (let i = 0; i < totalCards / 2; i++) {
      for (let j = 0; j < 2; j++) {
        cardData.push(i + "-" + j);
      }
    }

    const shuffledCards = [...cardData];

    // Fisher-Yates algorithm to shuffle.
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }

    const board = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => {
        const index = rowIndex * cols + colIndex;
        return { id: shuffledCards[index], isFlipped: false };
      })
    );

    return board;
  }

  function handleCardClick(clickedCard, rowIndex, colIndex) {
    if (isBoardDisabledRef.current) return;
    // If the card is already flipped or matched, don't flip it
    if (
      flippedCards.length < 2 &&
      !clickedCard.isFlipped &&
      !clickedCard.isMatched
    ) {
      setFlippedCards((prevFlipped) => [
        ...prevFlipped,
        { ...clickedCard, rowIndex, colIndex },
      ]);
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[rowIndex][colIndex].isFlipped = true;
        return newBoard;
      });
    }
  }

  function getMatchId(id) {
    return id.split("-")[0];
  }

  return (
    <>
      <Board
        board={board}
        handleCardClick={handleCardClick}
        isBoardDisabled={isBoardDisabled}
        flippedCards={flippedCards}
      />
      <GameStats
        timeLeft={timeLeft}
        moves={moves}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
      />
    </>
  );
}
