import { render, screen, fireEvent, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { Index } from "@/routes/index";

describe("Index", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the input field and submit button", () => {
    render(<Index />);
    expect(screen.getByTestId("timer-input")).toBeInTheDocument();
    expect(screen.getByTestId("timer-submit-button")).toHaveTextContent(
      "Submit",
    );
  });

  it("updates the input value when typing", () => {
    render(<Index />);
    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "hello",
      },
    });
    expect(input).toHaveValue("hello");
  });

  it("does not submit when input is empty", () => {
    render(<Index />);
    fireEvent.click(screen.getByTestId("timer-submit-button"));
    expect(screen.queryByTestId("timer-entries-list")).not.toBeInTheDocument();
  });

  it("does not submit when input is only whitespace", () => {
    render(<Index />);
    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "   ",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));
    expect(screen.queryByTestId("timer-entries-list")).not.toBeInTheDocument();
  });

  it("submits an entry with text and current timestamp", () => {
    vi.setSystemTime(new Date(0));
    render(<Index />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(5000));
      vi.advanceTimersByTime(10);
    });

    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "test entry",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));

    const entries = screen.getAllByTestId("timer-entry");
    expect(entries).toHaveLength(1);
    expect(entries[0]).toHaveTextContent("test entry");
    expect(entries[0]).toHaveTextContent("00:00:05.010");
  });

  it("clears the input after submission", () => {
    render(<Index />);
    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "test entry",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));
    expect(input).toHaveValue("");
  });

  it("submits multiple entries and displays all of them", () => {
    vi.setSystemTime(new Date(0));
    render(<Index />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    const input = screen.getByTestId("timer-input");

    act(() => {
      vi.setSystemTime(new Date(1000));
      vi.advanceTimersByTime(10);
    });

    fireEvent.change(input, {
      target: {
        value: "first",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));

    act(() => {
      vi.setSystemTime(new Date(3000));
      vi.advanceTimersByTime(10);
    });

    fireEvent.change(input, {
      target: {
        value: "second",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));

    const entries = screen.getAllByTestId("timer-entry");
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent("first");
    expect(entries[1]).toHaveTextContent("second");
  });

  it("submits an entry when pressing Enter", () => {
    render(<Index />);
    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "enter submit",
      },
    });
    fireEvent.keyDown(input, {
      key: "Enter",
    });

    const entries = screen.getAllByTestId("timer-entry");
    expect(entries).toHaveLength(1);
    expect(entries[0]).toHaveTextContent("enter submit");
  });

  it("captures timestamp at 00:00:00.000 when timer has not started", () => {
    render(<Index />);
    const input = screen.getByTestId("timer-input");
    fireEvent.change(input, {
      target: {
        value: "before start",
      },
    });
    fireEvent.click(screen.getByTestId("timer-submit-button"));

    const entries = screen.getAllByTestId("timer-entry");
    expect(entries[0]).toHaveTextContent("00:00:00.000");
  });
});
