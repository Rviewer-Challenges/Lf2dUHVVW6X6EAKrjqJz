import React from "react";

export default function Card({ card, cardIndex, onClick, isMatched }) {
  if (isMatched === null) isMatched = false;
  const handleClick = () => {
    if (!isMatched) {
      onClick();
    }
  };


  return (
    <div
      className={`card ${card.isFlipped || isMatched ? "flipped" : ""}`}
      onClick={handleClick}
      data-matched={isMatched}
      data-flipped={card.isFlipped}
      data-testid={`card-${card.id}`}
    >
      {card.isFlipped || isMatched ? card.id : ""}
    </div>
  );
}
