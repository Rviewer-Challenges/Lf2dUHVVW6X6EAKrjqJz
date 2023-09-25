import React, { useState, useEffect } from "react";
import Board from "./Board";
import GameStats from "./GameStats";

export default function Game({ rows, cols, timer, onVictory }) {
  if (rows <= 0 || cols <= 0) {
    throw new Error(
      "A negative or zero board size? That's possible only in the multiverse!"
    );
  }

  const { timeLeft, resetTimer, startTimer, stopTimer, isActive } = timer;

  const [board, setBoard] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const totalPairs = (rows * cols) / 2;

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
      setMoves((prevMoves) => prevMoves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (getMatchId(firstCard.id) !== getMatchId(secondCard.id)) {
        // Cards don't match, so flip them back after a delay
        setTimeout(() => {
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            flippedCards.forEach(({ rowIndex, colIndex }) => {
              newBoard[rowIndex][colIndex].isFlipped = false;
            });
            setFlippedCards([]); // Clear flipped cards
            return newBoard;
          });
        }, 1000);
      } else {
        // Cards match, mark them as matched in setBoard
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          flippedCards.forEach(({ rowIndex, colIndex }) => {
            newBoard[rowIndex][colIndex].isMatched = true;
          });
          setFlippedCards([]); // Clear flipped cards
          return newBoard;
        });
        setMatchedPairs((prevPairs) => prevPairs + 1);
        if (matchedPairs + 1 === totalPairs) {
          stopTimer();
          const remainingTime = timeLeft;
          alert(
            `¡Enhorabuena! Has completado el juego y te han sobrado ${remainingTime} segundos.`
          );
        }
      }
    }
  }, [flippedCards, matchedPairs, stopTimer, timeLeft, totalPairs]);

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
    if (
      flippedCards.length < 2 &&
      !clickedCard.isFlipped &&
      !clickedCard.isMatched
    ) {
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

  function getMatchId(id) {
    return id.split("-")[0];
  }

  return (
    <>
      <Board board={board} handleCardClick={handleCardClick} />
      <GameStats
        timeLeft={timeLeft}
        moves={moves}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
      />
    </>
  );
}