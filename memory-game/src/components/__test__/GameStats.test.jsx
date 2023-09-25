import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameStats from "../GameStats";

describe("GameStats", () => {
  test("renders the correct number of moves", () => {
    const { getByTestId } = render(<GameStats moves={10} />);
    expect(getByTestId("moves")).toHaveTextContent("10");
  });

  test("renders the correct time", () => {
    const { getByTestId } = render(<GameStats timeLeft={120} />);
    expect(getByTestId("timeLeft")).toHaveTextContent("120");
  });

  test("renders the correct matched pairs", () => {
    const { getByTestId } = render(<GameStats matchedPairs={2} />);
    expect(getByTestId("matched")).toHaveTextContent("2");
  });

  test("renders the correct remaining pairs", () => {
    const { getByTestId } = render(<GameStats matchedPairs={5} totalPairs={8} />);
    expect(getByTestId("remaining")).toHaveTextContent("3");
  });
});