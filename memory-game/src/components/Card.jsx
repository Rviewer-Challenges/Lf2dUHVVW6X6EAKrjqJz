import React from "react";
import cardBackImage from "/images/card-back.jpg";

export default function Card({ card, onClick, isFlipping }) {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  const displayId = card.id.split("-")[0];
  const imageId = card.id.split("-")[0];
  const imageSrc = `/images/card-${imageId}.jpg`;

  return (
    <div
      className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""} ${
        isFlipping ? "flipping" : ""
      } ${card.isFlipped || card.isMatched ? "" : "card-back"}`}
      onClick={handleClick}
      data-matched={card.isMatched ? "true" : "false"}
      data-flipped={card.isFlipped ? "true" : "false"}
      data-testid={`card-${card.id}`}
    >
      {card.isFlipped || card.isMatched ? (
        <img
          className="card-image"
          src={imageSrc}
          alt="Card"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <img
          className="card-image"
          src={cardBackImage}
          alt="Card Back"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
