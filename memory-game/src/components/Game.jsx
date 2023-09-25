import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import GameStats from "./GameStats";

export default function Game({
  rows,
  cols,
  timer,
  onVictory,
  onChangeDifficulty,
}) {
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
    console.log(
      "isBoardDisabled changed from ",
      isBoardDisabledRef.current,
      " to ",
      isBoardDisabled
    );
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
      console.log("firstCard", firstCard);
      console.log("secondCard", secondCard);
      console.log("getMatchId(firstCard.id)", getMatchId(firstCard.id));
      console.log("getMatchId(secondCard.id)", getMatchId(secondCard.id));

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
        setMatchedCards([...matchedCards, firstCard, secondCard]); // Agregar cartas emparejadas
        setFlippedCards([]); // Limpiar tarjetas volteadas
        setIsBoardDisabled(false); // Re-activar clics en el tablero
        setMatchedPairs(matchedPairs + 1); // Actualizar número de pares emparejados
      }
    }
  }, [flippedCards, matchedCards, matchedPairs]);

  function createBoard(rows, cols) {
    const totalCards = rows * cols;
    const cardData = [];

    for (let i = 0; i < totalCards / 2; i++) {
      for (let j = 0; j < 2; j++) {
        cardData.push(i + "-" + j);
      }
    }

    console.log("cardData", cardData);
    const shuffledCards = [...cardData];

    // Fisher-Yates algorithm to shuffle.
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }

    console.log("shuffledCards", shuffledCards);

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
      console.log(`Card clicked: ${clickedCard.name}`);
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
    <div className="game-container">
      <div className="game-stats">
        <GameStats
          timeLeft={timeLeft}
          moves={moves}
          matchedPairs={matchedPairs}
          totalPairs={totalPairs}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
      <div className="game-board">
        <Board
          board={board}
          handleCardClick={handleCardClick}
          isBoardDisabled={isBoardDisabled}
          flippedCards={flippedCards}
        />
      </div>
    </div>
  );
}
