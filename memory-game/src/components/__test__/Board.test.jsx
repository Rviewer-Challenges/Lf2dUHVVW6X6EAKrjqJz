import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../Board";
import { act } from "@testing-library/react";

vi.mock("./Card", () => {
  return function MockCard({ card, cardIndex, onClick }) {
    const matchedValue = card.isMatched ? "true" : "false";

    return (
      <div
        data-testid={`card-${card.id}`}
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
    // vi.spyOn(console, "error");
    // console.error.mockImplementation(() => {});
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // console.error.mockRestore();
  });

  test("Should not accept negative numbers or zero", () => {
    expect(() => {
      render(<Board rows={-1} cols={4} resetTimer={vi.fn()} />);
    }).toThrow(
      "A negative or zero board size? That's possible only in the multiverse!"
    );

    expect(() => {
      render(<Board rows={0} cols={0} resetTimer={vi.fn()} />);
    }).toThrow(
      "A negative or zero board size? That's possible only in the multiverse!"
    );
  });

  test("renders the board with the correct number of cards", () => {
    render(<Board rows={rows} cols={cols} />);
    const cards = screen.getAllByTestId(/card-\d+/);
    expect(cards).toHaveLength(rows * cols);
  });

  test("should have a shuffled board", () => {
    let totalSequenceCount = 0;
    const numberOfRuns = 100;

    for (let run = 0; run < numberOfRuns; run++) {
      render(<Board rows={4} cols={4} />);
      const cards = screen.getAllByTestId(/card-\d+/);
      const cardIds = cards.map((card) => card.getAttribute("data-testid"));
      let sequenceCount = 0;

      for (let i = 0; i < cardIds.length - 1; i++) {
        const currId = parseInt(cardIds[i].split("-")[1]);
        const nextId = parseInt(cardIds[i + 1].split("-")[1]);
        if (currId === nextId) {
          sequenceCount++;
        }
      }

      totalSequenceCount += sequenceCount;

      cleanup();
    }

    const averageSequenceCount = totalSequenceCount / numberOfRuns;
    expect(averageSequenceCount).toBeLessThan(8);
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

    act(() => {
      fireEvent.click(card);
    });

    expect(card.getAttribute("data-flipped")).toBe("true");
    expect(card.getAttribute("data-matched")).toBe("false");
  });

  test("tracks the number of moves", () => {
    render(<Board rows={rows} cols={cols} />);
    const moves = screen.getByText("Moves: 0");
    const card1 = screen.getByTestId("card-7-0");
    const card2 = screen.getByTestId("card-7-1");

    act(() => {
      fireEvent.click(card1);
      fireEvent.click(card2);
    });

    expect(moves.textContent).toBe("Moves: 1");
  });

  test("it should match pairs when two similar cards are clicked", () => {
    render(<Board rows={4} cols={4} />);

    const cards = screen.getAllByTestId(/^card-1/);

    act(() => {
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);
      vi.runAllTimers();
    });

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

  test("cards flip back when two non-matching cards are clicked", () => {
    render(<Board rows={rows} cols={cols} />);
    const card1 = screen.getByTestId("card-0-0");
    const card2 = screen.getByTestId("card-1-0");

    // Click two non-matching cards
    act(() => {
      fireEvent.click(card1);
      fireEvent.click(card2);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("card-0-0").getAttribute("data-flipped")).toBe(
      "false"
    );
    expect(screen.getByTestId("card-1-0").getAttribute("data-flipped")).toBe(
      "false"
    );
  });

  test("cards flip back and forth when two sets of non-matching cards are clicked", () => {
    render(<Board rows={rows} cols={cols} />);
    const card1 = screen.getByTestId("card-0-0");
    const card2 = screen.getByTestId("card-1-0");
    const card3 = screen.getByTestId("card-0-1");
    const card4 = screen.getByTestId("card-1-1");
  
    act(() => {
      fireEvent.click(card1);
      fireEvent.click(card2);
    });
  
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  
    expect(screen.getByTestId("card-0-0").getAttribute("data-flipped")).toBe(
      "false"
    );
    expect(screen.getByTestId("card-1-0").getAttribute("data-flipped")).toBe(
      "false"
    );
  
    act(() => {
      fireEvent.click(card3);
      fireEvent.click(card4);
    });
  
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  
    expect(screen.getByTestId("card-0-1").getAttribute("data-flipped")).toBe(
      "false"
    );
    expect(screen.getByTestId("card-1-1").getAttribute("data-flipped")).toBe(
      "false"
    );
  });
  
});
