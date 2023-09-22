import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryCard } from "./MemoryCard";
import "@testing-library/jest-dom";

it("MemoryCard displays its position", async () => {
  const position = [2, 1];
  render(<MemoryCard position={position} />);
  const textbox = screen.getByText('2, 1');

  expect(textbox).toBeInTheDocument();
});
