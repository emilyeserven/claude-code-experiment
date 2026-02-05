import { render, screen, fireEvent, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { formatTime } from "@/utils/formatTime";

import { Timer } from "./Timer";

describe("formatTime", () => {
  it("formats zero milliseconds", () => {
    expect(formatTime(0)).toBe("00:00:00.000");
  });

  it("formats milliseconds into HH:MM:SS.mmm", () => {
    expect(formatTime(3661001)).toBe("01:01:01.001");
  });
});

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with initial time of 00:00:00.000", () => {
    render(<Timer />);
    expect(screen.getByTestId("timer-display")).toHaveTextContent(
      "00:00:00.000",
    );
  });

  it("renders start, stop, and reset buttons", () => {
    render(<Timer />);
    expect(screen.getByTestId("timer-start-button")).toHaveTextContent(
      "Start Timer",
    );
    expect(screen.getByTestId("timer-stop-button")).toHaveTextContent(
      "Stop Timer",
    );
    expect(screen.getByTestId("timer-reset-button")).toHaveTextContent(
      "Reset Timer",
    );
  });

  it("starts the timer when start is clicked", () => {
    vi.setSystemTime(new Date(0));
    render(<Timer />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(1490));
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByTestId("timer-display")).toHaveTextContent(
      "00:00:01.500",
    );
  });

  it("stops the timer when stop is clicked", () => {
    vi.setSystemTime(new Date(0));
    render(<Timer />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(990));
      vi.advanceTimersByTime(10);
    });

    fireEvent.click(screen.getByTestId("timer-stop-button"));

    act(() => {
      vi.setSystemTime(new Date(5000));
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByTestId("timer-display")).toHaveTextContent(
      "00:00:01.000",
    );
  });

  it("resets the timer when reset is clicked", () => {
    vi.setSystemTime(new Date(0));
    render(<Timer />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(2000));
      vi.advanceTimersByTime(10);
    });

    fireEvent.click(screen.getByTestId("timer-reset-button"));

    expect(screen.getByTestId("timer-display")).toHaveTextContent(
      "00:00:00.000",
    );
  });

  it("disables start button while running", () => {
    render(<Timer />);
    fireEvent.click(screen.getByTestId("timer-start-button"));
    expect(screen.getByTestId("timer-start-button")).toBeDisabled();
  });

  it("disables stop button while not running", () => {
    render(<Timer />);
    expect(screen.getByTestId("timer-stop-button")).toBeDisabled();
  });

  it("calls onTick with elapsed milliseconds on each interval", () => {
    const onTick = vi.fn();
    vi.setSystemTime(new Date(0));
    render(<Timer onTick={onTick} />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(1000));
      vi.advanceTimersByTime(10);
    });

    expect(onTick).toHaveBeenCalledWith(1010);
  });

  it("calls onTick with 0 when timer is reset", () => {
    const onTick = vi.fn();
    vi.setSystemTime(new Date(0));
    render(<Timer onTick={onTick} />);

    fireEvent.click(screen.getByTestId("timer-start-button"));

    act(() => {
      vi.setSystemTime(new Date(1000));
      vi.advanceTimersByTime(10);
    });

    onTick.mockClear();
    fireEvent.click(screen.getByTestId("timer-reset-button"));

    expect(onTick).toHaveBeenCalledWith(0);
  });
});
