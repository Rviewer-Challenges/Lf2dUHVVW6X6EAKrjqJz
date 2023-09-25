import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "../Card";

describe("Card", () => {
  let mockOnClick;

  beforeEach(() => {
    mockOnClick = vi.fn();
  });

  test("render correctly", () => {
    render(
      <Card
        card={{ id: "1-0", isFlipped: false, isMatched: false }}
        cardIndex={0}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByTestId("card-1-0")).toHaveClass("card"); // Actualizar el data-testid
  });

  test("display card image (not the back part) when isFlipped is true", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: true, isMatched: false }}
        onClick={mockOnClick}
      />
    );

    const cardImage = screen.getByAltText("Card");
    expect(cardImage).toBeInTheDocument();
    expect(cardImage).not.toHaveClass("card-back");
  });

  test("display card image (not the back part) when isMatched is true", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: true, isMatched: false }}
        onClick={mockOnClick}
      />
    );

    const cardImage = screen.getByAltText("Card");
    expect(cardImage).toBeInTheDocument();
    expect(cardImage).toHaveClass("card-image");
    expect(cardImage).not.toHaveClass("card-back");
  });

  test("trigger onClick when card is clicked", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: false, isMatched: false }}
        cardIndex={0}
        onClick={mockOnClick}
      />
    );
    fireEvent.click(screen.getByTestId("card-0-0"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test("not trigger onClick when card is clicked if already matched", () => {
    render(
      <Card
        card={{ id: "1-0", isFlipped: false, isMatched: true }}
        cardIndex={4}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByTestId("card-1-0"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test("card is rendered facing down for the first time", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: false, isMatched: false }}
        onClick={mockOnClick}
      />
    );

    const cardImage = screen.getByTestId("card-0-0");
    expect(cardImage).toBeInTheDocument();
    expect(cardImage).toHaveClass("card card-back");
  });

  test("have 'flipped' class when isFlipped is true", () => {
    render(
      <Card
        card={{ id: "1-1", isFlipped: true, isMatched: false }}
        cardIndex={0}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByTestId("card-1-1")).toHaveClass("flipped");
  });
});
