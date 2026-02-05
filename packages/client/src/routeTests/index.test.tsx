import { render, screen, fireEvent, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { Index } from "@/routes/index";

describe("Index", () => {
  beforeEach(() => {
    localStorage.clear();
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

  it("shows empty state when there are no entries", () => {
    render(<Index />);
    expect(screen.getByTestId("timer-entries-empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("timer-entry")).toHaveLength(0);
  });

  it("does not submit when input is empty", () => {
    render(<Index />);
    fireEvent.click(screen.getByTestId("timer-submit-button"));
    expect(screen.getByTestId("timer-entries-empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("timer-entry")).toHaveLength(0);
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
    expect(screen.getByTestId("timer-entries-empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("timer-entry")).toHaveLength(0);
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

  describe("multiselect and delete", () => {
    function addEntries(count: number) {
      const input = screen.getByTestId("timer-input");
      const labels = ["alpha", "beta", "gamma", "delta", "epsilon"];
      for (let i = 0; i < count; i++) {
        fireEvent.change(input, {
          target: {
            value: labels[i],
          },
        });
        fireEvent.click(screen.getByTestId("timer-submit-button"));
      }
    }

    it("can select rows and delete them via bulk delete", () => {
      render(<Index />);
      addEntries(3);

      expect(screen.getAllByTestId("timer-entry")).toHaveLength(3);

      const checkboxes = screen.getAllByTestId("row-checkbox");
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[2]);

      fireEvent.click(screen.getByTestId("delete-selected-button"));
      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      const remaining = screen.getAllByTestId("timer-entry");
      expect(remaining).toHaveLength(1);
      expect(remaining[0]).toHaveTextContent("beta");
    });

    it("bulk delete removes all entries and shows empty state", () => {
      render(<Index />);
      addEntries(2);

      const checkboxes = screen.getAllByTestId("row-checkbox");
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      fireEvent.click(screen.getByTestId("delete-selected-button"));
      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      expect(screen.getByTestId("timer-entries-empty")).toBeInTheDocument();
      expect(screen.queryAllByTestId("timer-entry")).toHaveLength(0);
    });

    it("cancelling bulk delete preserves all entries", () => {
      render(<Index />);
      addEntries(3);

      const checkboxes = screen.getAllByTestId("row-checkbox");
      fireEvent.click(checkboxes[0]);

      fireEvent.click(screen.getByTestId("delete-selected-button"));
      fireEvent.click(screen.getByTestId("cancel-delete-button"));

      expect(screen.getAllByTestId("timer-entry")).toHaveLength(3);
    });
  });
});
