import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Game from "../Game";
import { act } from "@testing-library/react";

const mockTimer = {
  timeLeft: 60,
  resetTimer: vi.fn(),
  startTimer: vi.fn(),
  stopTimer: vi.fn(),
  isActive: false,
};

describe("Board Component", () => {
  const rows = 4;
  const cols = 4;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    console.error.mockRestore();
  });

  test("renders the board with the correct number of cards", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );
    const cards = screen.getAllByTestId(/card-\d+/);
    expect(cards).toHaveLength(rows * cols);
  });

  test("Should not accept negative numbers or zero", () => {
    expect(() => {
      render(<Game rows={-1} cols={4} timer={mockTimer} onVictory={vi.fn()} />);
    }).toThrow(
      "A negative or zero board size? That's possible only in the multiverse!"
    );

    expect(() => {
      render(<Game rows={0} cols={0} resetTimer={vi.fn()} />);
    }).toThrow(
      "A negative or zero board size? That's possible only in the multiverse!"
    );
  });

  test("renders the board with the correct number of cards", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );
    const cards = screen.getAllByTestId(/card-\d+/);
    expect(cards).toHaveLength(rows * cols);
  });

  test("should have a shuffled board", () => {
    let totalSequenceCount = 0;
    const numberOfRuns = 100;

    for (let run = 0; run < numberOfRuns; run++) {
      render(
        <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
      );
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
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

    const cards = screen.getAllByTestId(/card-\d+-\d+/);
    cards.forEach((card) => {
      expect(card.getAttribute("data-matched")).toBe("false");
    });
  });

  test("flips a card when clicked", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

    const card = screen.getByTestId("card-2-0");

    act(() => {
      fireEvent.click(card);
    });

    expect(card.getAttribute("data-flipped")).toBe("true");
    expect(card.getAttribute("data-matched")).toBe("false");
  });

  test("tracks the number of moves", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );
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
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

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

  test("it should match pairs when two similar cards are clicked and allow continued play", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

    // Matching the first pair
    const firstPair = screen.getAllByTestId(/^card-1/);
    act(() => {
      fireEvent.click(firstPair[0]);
      fireEvent.click(firstPair[1]);
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

    // Attempting to match a second pair
    const secondPair = screen.getAllByTestId(/^card-2/);
    act(() => {
      fireEvent.click(secondPair[0]);
      fireEvent.click(secondPair[1]);
      vi.runAllTimers();
    });

    waitFor(
      () => {
        const matchedCards = screen
          .getAllByTestId(/^card-2/)
          .filter((card) => card.getAttribute("data-matched") === "true");
        expect(matchedCards.length).toBe(2);
      },
      { timeout: 2000 }
    );
  });

  test("cards flip back when two non-matching cards are clicked", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

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
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

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

  test("prevents user from clicking more than two non-matching cards within the same movement", () => {
    render(
      <Game rows={rows} cols={cols} timer={mockTimer} onVictory={vi.fn()} />
    );

    const card1 = screen.getByTestId("card-0-0");
    const card2 = screen.getByTestId("card-1-0");
    const card3 = screen.getByTestId("card-2-0");

    act(() => {
      fireEvent.click(card1);
      fireEvent.click(card2);
    });

    expect(screen.getByTestId("card-0-0").getAttribute("data-flipped")).toBe(
      "true"
    );
    expect(screen.getByTestId("card-1-0").getAttribute("data-flipped")).toBe(
      "true"
    );

    act(() => {
      vi.advanceTimersByTime(950);
    });

    act(() => {
      fireEvent.click(card3);
    });

    expect(screen.getByTestId("card-2-0").getAttribute("data-flipped")).toBe(
      "false"
    );
  });
});
