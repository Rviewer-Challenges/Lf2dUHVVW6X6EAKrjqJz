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
        card={{ id: 1, isFlipped: false }}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByTestId("card")).toHaveClass("card");
  });

  it("should display card id when isFlipped is true", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: true }}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should display card id when isMatched is true", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: false }}
        onClick={mockOnClick}
        isMatched={true}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should trigger onClick when card is clicked", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: false }}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    fireEvent.click(screen.getByTestId("card"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should not trigger onClick when card is clicked if already matched", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: false }}
        onClick={mockOnClick}
        isMatched={true}
      />
    );
  
    fireEvent.click(screen.getByTestId("card"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });
  

  it("should not display card id when neither isFlipped nor isMatched is true", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: false }}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("should have 'flipped' class when isFlipped is true", () => {
    render(
      <Card
        card={{ id: 1, isFlipped: true }}
        onClick={mockOnClick}
        isMatched={false}
      />
    );
    expect(screen.getByTestId("card")).toHaveClass("flipped");
  });
});
