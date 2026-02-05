import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { SettingsPopover } from "./SettingsPopover";

import { ThemeProvider } from "@/context/ThemeProvider";

function renderWithTheme(defaultTheme: "light" | "dark" = "light") {
  return render(
    <ThemeProvider
      defaultTheme={defaultTheme}
      storageKey="test-theme"
    >
      <SettingsPopover />
    </ThemeProvider>,
  );
}

describe("SettingsPopover", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the settings trigger button", () => {
    renderWithTheme();
    expect(screen.getByTestId("settings-trigger")).toBeInTheDocument();
  });

  it("opens the popover when clicking the settings trigger", () => {
    renderWithTheme();
    fireEvent.click(screen.getByTestId("settings-trigger"));
    expect(screen.getByRole("heading", {
      name: "Settings",
    })).toBeInTheDocument();
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  it("renders the dark mode toggle as a switch", () => {
    renderWithTheme();
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("role", "switch");
  });

  it("shows the switch as unchecked in light mode", () => {
    renderWithTheme("light");
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");
    expect(toggle).toHaveAttribute("data-state", "unchecked");
  });

  it("shows the switch as checked in dark mode", () => {
    renderWithTheme("dark");
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");
    expect(toggle).toHaveAttribute("data-state", "checked");
  });

  it("toggles to dark mode when the switch is clicked", () => {
    renderWithTheme("light");
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("data-state", "checked");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles back to light mode when the switch is clicked again", () => {
    renderWithTheme("light");
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");

    // Enable dark mode
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "checked");

    // Disable dark mode
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "unchecked");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("contains sun and moon icons in the switch track", () => {
    renderWithTheme();
    fireEvent.click(screen.getByTestId("settings-trigger"));
    const toggle = screen.getByTestId("dark-mode-toggle");

    // The switch track should contain both sun and moon SVG icons
    const svgs = toggle.querySelectorAll(":scope > svg");
    expect(svgs.length).toBe(2);
  });
});
