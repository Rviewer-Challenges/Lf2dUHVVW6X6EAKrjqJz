import React from "react";
import { render } from "@testing-library/react";
import GameStats from "../GameStats";

describe("GameStats", () => {
  it("renders the correct number of moves", () => {
    const { getByTestId } = render(<GameStats moves={10} />);
    expect(getByTestId("moves")).toHaveTextContent("10");
  });

  it("renders the correct time", () => {
    const { getByTestId } = render(<GameStats time={120} />);
    expect(getByTestId("time")).toHaveTextContent("120");
  });
});