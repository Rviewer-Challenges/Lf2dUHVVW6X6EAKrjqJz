import { it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryCard } from "./MemoryCard";
import "@testing-library/jest-dom";

it("MemoryCard displays faces down", async () => {
  const position = [2, 1];
  render(<MemoryCard position={position} />);

  expect(screen.queryByText("2, 1")).not.toBeInTheDocument();
});

test("Button makes the card to face up - show value, and then face down - hide value", () => {
  const position = [2, 1];
  render(<MemoryCard position={position} />);
  const notVisiblePositionBefore = screen.queryByText("2, 1");

  expect(notVisiblePositionBefore).toBeNull();

  const button = screen.getByRole("button", { name: "Click here" });
  fireEvent.click(button);
  const visiblePositionAfter = screen.getByText("2, 1");

  expect(visiblePositionAfter).toBeInTheDocument();

  fireEvent.click(button);

  const notVisiblePositionAfter = screen.queryByText("2, 1");
  expect(notVisiblePositionAfter).toBeNull();
});


