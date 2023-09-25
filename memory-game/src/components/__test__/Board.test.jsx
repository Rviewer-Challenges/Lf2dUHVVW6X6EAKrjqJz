import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../Board";

describe("Board", () => {
  const board = [
    [
      { id: "0-0", isFlipped: false },
      { id: "0-1", isFlipped: false },
    ],
    [
      { id: "1-0", isFlipped: false },
      { id: "1-1", isFlipped: false },
    ],
  ];

  const handleCardClick = vi.fn();

  test("renders the board with the correct number of rows and columns", () => {
    const { getByTestId } = render(<Board board={board} />);
    const boardElement = getByTestId("board");

    expect(boardElement.children.length).toBe(4);
  });

  test("renders a loading message when the board is not yet loaded", () => {
    const { getByText } = render(
      <Board board={null} handleCardClick={handleCardClick} />
    );
    const loadingElement = getByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  test("calls the handleCardClick function when a card is clicked", () => {
    const { getByTestId } = render(
      <Board board={board} handleCardClick={handleCardClick} />
    );
    const cardElement = getByTestId("card-0-0");
    fireEvent.click(cardElement);
    expect(handleCardClick).toHaveBeenCalledWith(board[0][0], 0, 0);
  });
});
