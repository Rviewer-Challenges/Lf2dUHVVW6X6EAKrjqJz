import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "../Card";

describe("Card", () => {
  let mockOnClick;

  beforeEach(() => {
    mockOnClick = vi.fn();
  });

  it("should render correctly", () => {
    render(
      <Card
        card={{ id: "1-0", isFlipped: false }}
        cardIndex={0} // Agregar cardIndex
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByTestId("card-1-0")).toHaveClass("card"); // Actualizar el data-testid
  });

  it("should display card id when isFlipped is true", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: true }}
        cardIndex={0}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByText("0-0")).toBeInTheDocument();
  });

  it("should display card id when isMatched is true", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: false }}
        cardIndex={0}
        onClick={mockOnClick}
        isMatched={true}
      />
    );
    expect(screen.getByText("0-0")).toBeInTheDocument();
  });

  it("should trigger onClick when card is clicked", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: false }}
        cardIndex={0}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    fireEvent.click(screen.getByTestId("card-0-0"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should not trigger onClick when card is clicked if already matched", () => {
    render(
      <Card
        card={{ id: "1-0", isFlipped: false }}
        cardIndex={4}
        onClick={mockOnClick}
        isMatched={true}
      />
    );

    fireEvent.click(screen.getByTestId("card-1-0"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should not display card id when neither isFlipped nor isMatched is true", () => {
    render(
      <Card
        card={{ id: "0-0", isFlipped: false }}
        cardIndex={0}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.queryByText("0-0")).not.toBeInTheDocument();
  });

  it("should have 'flipped' class when isFlipped is true", () => {
    render(
      <Card
        card={{ id: "1-1", isFlipped: true }}
        cardIndex={0}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByTestId("card-1-1")).toHaveClass("flipped");
  });
});
