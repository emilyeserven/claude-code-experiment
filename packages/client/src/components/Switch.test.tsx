import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders an unchecked switch by default", () => {
    render(<Switch data-testid="switch" />);
    const switchEl = screen.getByTestId("switch");
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("renders a checked switch when checked prop is true", () => {
    render(
      <Switch
        data-testid="switch"
        checked
      />,
    );
    const switchEl = screen.getByTestId("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it("calls onCheckedChange when clicked", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        data-testid="switch"
        onCheckedChange={onCheckedChange}
      />,
    );
    fireEvent.click(screen.getByTestId("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles from checked to unchecked on click", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        data-testid="switch"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    fireEvent.click(screen.getByTestId("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("does not call onCheckedChange when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        data-testid="switch"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    fireEvent.click(screen.getByTestId("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("renders the thumb element", () => {
    render(<Switch data-testid="switch" />);
    const thumb = screen.getByTestId("switch").querySelector("[data-slot='switch-thumb']");
    expect(thumb).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Switch
        data-testid="switch"
        className="mt-4"
      />,
    );
    expect(screen.getByTestId("switch")).toHaveClass("mt-4");
  });
});
