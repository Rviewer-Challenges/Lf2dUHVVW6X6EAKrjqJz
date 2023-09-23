import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../Board";
import { renderHook } from "@testing-library/react-hooks";

vi.mock("./Card", () => {
    return function MockCard({ card, cardIndex, isMatched, onClick }) {
      const matchedValue = isMatched ? "true" : "false";
  
      return (
        <div
          data-testid={`card-${card.id}-${cardIndex}`}
          data-matched={matchedValue}
          onClick={onClick}
        >
          Card
        </div>
      );
    };
  });


describe("Board Component", () => {
  const rows = 4;
  const cols = 4;

  beforeEach(() => {
    vi.clearAllMocks();

  });  

  it("renders the board with the correct number of cards", () => {
    render(<Board rows={rows} cols={cols} />);
    const cards = screen.getAllByTestId(/card-\d+/);
    expect(cards).toHaveLength(rows * cols);
  });

  it("starts with all cards face down", () => {
    render(<Board rows={rows} cols={cols} />);

    const cards = screen.getAllByTestId(/card-\d+-\d+/);
    cards.forEach((card) => {
      expect(card.getAttribute("data-matched")).toBe("false");
    });
  });

  it("flips a card when clicked", () => {
    render(<Board rows={rows} cols={cols} />);
    const card = screen.getByTestId("card-2-0");
    fireEvent.click(card);

    expect(card.getAttribute("data-flipped")).toBe("true");
    expect(card.getAttribute("data-matched")).toBe("false");
  });

  it("tracks the number of moves", () => {
    render(<Board rows={rows} cols={cols} />);
    const moves = screen.getByText("Moves: 0");
    const card1 = screen.getByTestId("card-7-0");
    const card2 = screen.getByTestId("card-7-1");
    fireEvent.click(card1);
    fireEvent.click(card2);

    expect(moves.textContent).toBe("Moves: 1");
  });
});
