import React, { useState } from "react";

export function MemoryCard({ position }) {
  const [isVisible, setIsVisible] = useState(false);
  const [x, y] = position;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {isVisible && (
        <p>
          {x}, {y}
        </p>
      )}
      <button onClick={toggleVisibility}>Click here</button>
    </>
  );
}
