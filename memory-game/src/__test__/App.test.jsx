import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  getAllByTestId,
  queryByText,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import Game from "../components/Game";

describe("App", () => {
  const mockTimer = {
    timeLeft: 60,
    resetTimer: vi.fn(),
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    isActive: false,
  };

  let clock;

  beforeEach(() => {
    vi.clearAllMocks();
    clock = vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders the title when no difficulty is selected", () => {
    const { getByText } = render(<App />);
    expect(getByText("Cards Memory Game")).toBeInTheDocument();
  });

  test("renders the difficulty selection menu when no difficulty is selected", () => {
    const { getByText } = render(<App />);
    expect(getByText("Select level of difficulty")).toBeInTheDocument();
    expect(getByText("Easy")).toBeInTheDocument();
    expect(getByText("Medium")).toBeInTheDocument();
    expect(getByText("Difficult")).toBeInTheDocument();
  });

  test("starts the game when a difficulty is selected", () => {
    const { getByText, queryByText } = render(<App />);
    fireEvent.click(getByText("Easy"));
    expect(queryByText("Select level of difficulty")).not.toBeInTheDocument();
    expect(queryByText("Easy")).not.toBeInTheDocument();
    expect(queryByText("Medium")).not.toBeInTheDocument();
    expect(queryByText("Difficult")).not.toBeInTheDocument();
  });

  test("shows the game over message when the timer runs out", () => {
    const { getByText } = render(<App />);
    fireEvent.click(getByText("Easy"));
    act(() => {
      clock.advanceTimersByTime(60000);
    });
    expect(getByText("Game over")).toBeInTheDocument();
  });

  test("shows the victory message when the game is completed", () => {
    const onVictory = vi.fn();
    render(<Game rows={1} cols={2} timer={mockTimer} onVictory={onVictory} />);

    const card1 = screen.getByTestId("card-0-0");
    const card2 = screen.getByTestId("card-0-1");

    act(() => {
      fireEvent.click(card1);
      fireEvent.click(card2);
      vi.runAllTimers();
    });

    expect(onVictory).toHaveBeenCalled();
  });
});
