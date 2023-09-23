import React from "react";

export default function Card({ card, onClick, isMatched }) {
  const handleClick = () => {
    if (!isMatched) {
      onClick();
    }
  };

  return (
    <div
      className={`card ${card.isFlipped || isMatched ? "flipped" : ""}`}
      onClick={handleClick}
      data-testid="card"
    >
      {card.isFlipped || isMatched ? card.id : ""}
    </div>
  );
}
