import React from "react";

export function MemoryCard({ position }) {
  const [x, y] = position;
  return (
    <p>
      {x}, {y}
    </p>
  );
}
