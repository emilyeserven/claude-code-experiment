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

  test("dark mode toggle button label changes between Dark and Light", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();

    const toggle = page.getByTestId("dark-mode-toggle");

    // Default theme is light, so button should say "Dark"
    await expect(toggle).toContainText("Dark");

    // Click to enable dark mode
    await toggle.click();
    await expect(toggle).toContainText("Light");

    // Click again to go back to light
    await toggle.click();
    await expect(toggle).toContainText("Dark");
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

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("vite-ui-theme"));
    expect(storedTheme).toBe("dark");
  });
});
