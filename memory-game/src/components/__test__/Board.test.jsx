import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../Board";
import { renderHook, act } from "@testing-library/react-hooks";

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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("Should not accept negative numbers or zero", () => {
    const { result } = renderHook(() =>
      Board({ rows: -1, cols: 4, resetTimer: vi.fn() })
    );
    expect(result.error).toEqual(expect.any(Error));
    expect(result.error).toEqual(
      new Error(
        "A negative or zero board size? That's possible only in the multiverse!"
      )
    );

    const { result: result2 } = renderHook(() =>
      Board({ rows: 0, cols: 0, resetTimer: vi.fn() })
    );
    expect(result2.error).toEqual(expect.any(Error));
    expect(result2.error).toEqual(
      new Error(
        "A negative or zero board size? That's possible only in the multiverse!"
      )
    );
  });

  test("renders the board with the correct number of cards", () => {
    render(<Board rows={rows} cols={cols} />);
    const cards = screen.getAllByTestId(/card-\d+/);
    expect(cards).toHaveLength(rows * cols);
  });

  test("should have a shuffled board", () => {
    const rows = 4;
    const cols = 4;

    render(<Board rows={rows} cols={cols} />);

    const cards = screen.getAllByTestId(/card-\d+/);
    const cardIds = cards.map((card) => card.getAttribute("data-testid"));

    let sequenceCount = 0;

    for (let i = 0; i < cardIds.length - 1; i++) {
      const currId = parseInt(cardIds[i].split("-")[1]);
      const nextId = parseInt(cardIds[i + 1].split("-")[1]);

      if (currId + 1 === nextId || currId - 1 === nextId) {
        sequenceCount++;
      }
    }

    expect(sequenceCount).toBeLessThan(6);
  });

  test("starts with all cards face down", () => {
    render(<Board rows={rows} cols={cols} />);

    const cards = screen.getAllByTestId(/card-\d+-\d+/);
    cards.forEach((card) => {
      expect(card.getAttribute("data-matched")).toBe("false");
    });
  });

  test("flips a card when clicked", () => {
    render(<Board rows={rows} cols={cols} />);
    const card = screen.getByTestId("card-2-0");
    fireEvent.click(card);

    expect(card.getAttribute("data-flipped")).toBe("true");
    expect(card.getAttribute("data-matched")).toBe("false");
  });

  test("tracks the number of moves", () => {
    render(<Board rows={rows} cols={cols} />);
    const moves = screen.getByText("Moves: 0");
    const card1 = screen.getByTestId("card-7-0");
    const card2 = screen.getByTestId("card-7-1");
    fireEvent.click(card1);
    fireEvent.click(card2);

    expect(moves.textContent).toBe("Moves: 1");
  });

  test("it should match pairs when two similar cards are clicked", () => {
    render(<Board rows={4} cols={4} />);

    const cards = screen.getAllByTestId(/^card-1/);

    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);

    vi.runAllTimers();

    waitFor(
      () => {
        const matchedCards = screen
          .getAllByTestId(/^card-1/)
          .filter((card) => card.getAttribute("data-matched") === "true");
        expect(matchedCards.length).toBe(2);
      },
      { timeout: 2000 }
    );
  });
});
