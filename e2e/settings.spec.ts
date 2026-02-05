import { expect, test } from "@playwright/test";

test.describe("Settings and dark mode", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
  });

  test("opens the settings popover when clicking the settings button", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await expect(page.getByText("Settings").first()).toBeVisible();
    await expect(page.getByText("Dark Mode")).toBeVisible();
  });

  test("toggles dark mode on", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("dark-mode-toggle").click();

    // The documentElement should have the "dark" class
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"));
    expect(hasDarkClass).toBe(true);
  });

  test("toggles dark mode off after enabling it", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();

    // Enable dark mode
    await page.getByTestId("dark-mode-toggle").click();
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"));
    expect(hasDarkClass).toBe(true);

    // Disable dark mode
    await page.getByTestId("dark-mode-toggle").click();
    const stillDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"));
    expect(stillDark).toBe(false);
  });

  test("dark mode toggle switch state reflects the current theme", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();

    const toggle = page.getByTestId("dark-mode-toggle");

    // Default theme is light, so switch should be unchecked
    await expect(toggle).toHaveAttribute("data-state", "unchecked");

    // Click to enable dark mode
    await toggle.click();
    await expect(toggle).toHaveAttribute("data-state", "checked");

    // Click again to go back to light
    await toggle.click();
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  });

  test("dark mode toggle is rendered as a switch with role='switch'", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    const toggle = page.getByTestId("dark-mode-toggle");
    await expect(toggle).toHaveRole("switch");
  });

  test("dark mode preference persists across page reloads", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("dark-mode-toggle").click();

    // Verify dark mode is active
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"));
    expect(hasDarkClass).toBe(true);

    // Reload the page
    await page.reload();

    // Dark mode should still be active
    const stillDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"));
    expect(stillDark).toBe(true);
  });

  test("dark mode preference is stored in localStorage", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("dark-mode-toggle").click();

    const storedTheme = await page.evaluate(() => {
      const raw = localStorage.getItem("vite-ui-theme");
      return raw !== null ? JSON.parse(raw) : null;
    });
    expect(storedTheme).toBe("dark");
  });
});
