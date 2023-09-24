import React from "react";

export default function Card({ card, onClick }) {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  const displayId = card.id.split("-")[0];

  return (
    <div
      className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
      onClick={handleClick}
      data-matched={card.isMatched ? "true" : "false"}
      data-flipped={card.isFlipped ? "true" : "false"}
      data-testid={`card-${card.id}`}
    >
      {card.isFlipped || card.isMatched ? displayId : ""}
    </div>
  );
}
