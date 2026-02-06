import { expect, test } from "@playwright/test";

test.describe("Settings and dark mode", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
  });

  test("opens the settings popover with dark mode toggle", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await expect(page.getByText("Settings").first()).toBeVisible();
    await expect(page.getByText("Dark Mode")).toBeVisible();

    const toggle = page.getByTestId("dark-mode-toggle");
    await expect(toggle).toHaveRole("switch");
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  });

  test("toggles dark mode on and off", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    const toggle = page.getByTestId("dark-mode-toggle");

    // Enable dark mode
    await toggle.click();
    expect(await page.evaluate(() =>
      document.documentElement.classList.contains("dark"))).toBe(true);
    await expect(toggle).toHaveAttribute("data-state", "checked");

    // Disable dark mode
    await toggle.click();
    expect(await page.evaluate(() =>
      document.documentElement.classList.contains("dark"))).toBe(false);
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  });

  test("dark mode persists in localStorage and across page reloads", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("dark-mode-toggle").click();

    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      const raw = localStorage.getItem("vite-ui-theme");
      return raw !== null ? JSON.parse(raw) : null;
    });
    expect(storedTheme).toBe("dark");

    // Reload and verify persistence
    await page.reload();
    expect(await page.evaluate(() =>
      document.documentElement.classList.contains("dark"))).toBe(true);
  });
});
