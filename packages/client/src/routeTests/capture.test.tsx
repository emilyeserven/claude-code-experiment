import { render, screen, fireEvent } from "@testing-library/react";
import { describe, beforeEach, test, expect, vi } from "vitest";

import { Capture } from "@/routes/capture";
// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("Capture Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  const renderComponent = () => render(<Capture />);

  test("renders heading and description", () => {
    renderComponent();

    expect(screen.getByTestId("capture-heading")).toHaveTextContent("Capture");
    expect(screen.getByTestId("capture-description")).toBeInTheDocument();
  });

  test("renders directions and prompt inputs", () => {
    renderComponent();

    expect(screen.getByTestId("directions-input")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-input")).toBeInTheDocument();
    expect(screen.getByTestId("capture-submit")).toBeInTheDocument();
  });

  test("saves an entry when the form is submitted", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("directions-input"), {
      target: {
        value: "Test directions",
      },
    });
    fireEvent.change(screen.getByTestId("prompt-input"), {
      target: {
        value: "Test prompt",
      },
    });
    fireEvent.click(screen.getByTestId("capture-submit"));

    expect(screen.getByTestId("entries-section")).toBeInTheDocument();
    expect(screen.getByTestId("entry-0-directions")).toHaveTextContent("Test directions");
    expect(screen.getByTestId("entry-0-prompt")).toHaveTextContent("Test prompt");
  });

  test("clears the form inputs after submission", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("directions-input"), {
      target: {
        value: "Some directions",
      },
    });
    fireEvent.change(screen.getByTestId("prompt-input"), {
      target: {
        value: "Some prompt",
      },
    });
    fireEvent.click(screen.getByTestId("capture-submit"));

    expect(screen.getByTestId("directions-input")).toHaveValue("");
    expect(screen.getByTestId("prompt-input")).toHaveValue("");
  });

  test("does not submit when both fields are empty", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("capture-submit"));

    expect(screen.queryByTestId("entries-section")).not.toBeInTheDocument();
  });

  test("clears all entries when Clear All is clicked", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("directions-input"), {
      target: {
        value: "Directions",
      },
    });
    fireEvent.click(screen.getByTestId("capture-submit"));

    expect(screen.getByTestId("entries-section")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("clear-all-button"));

    expect(screen.queryByTestId("entries-section")).not.toBeInTheDocument();
  });
});
