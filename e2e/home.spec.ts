import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
  });

  test("shows the timer at 00:00:00.000", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");
    await expect(display).toHaveText("00:00:00.000");
  });

  test("shows only start button when timer is idle at zero", async ({
    page,
  }) => {
    await expect(page.getByTestId("timer-start-button")).toBeVisible();
    await expect(page.getByTestId("timer-stop-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-reset-button")).toHaveCount(0);
  });

  test("start button begins the timer and stop button pauses it", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");
    await expect(display).toHaveText("00:00:00.000");

    await page.getByTestId("timer-start-button").click();

    // Start button should be hidden, stop button should appear
    await expect(page.getByTestId("timer-start-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-stop-button")).toBeVisible();

    // Wait for timer to advance past zero
    await expect(display).not.toHaveText("00:00:00.000", {
      timeout: 3000,
    });

    await page.getByTestId("timer-stop-button").click();

    // Stop button should be hidden, start button should reappear
    await expect(page.getByTestId("timer-stop-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-start-button")).toBeVisible();

    // Record the time after stopping
    const stoppedTime = await display.textContent();

    // Wait a moment and verify the timer is no longer advancing
    await page.waitForTimeout(200);
    await expect(display).toHaveText(stoppedTime!);
  });

  test("reset button returns the timer to zero and disappears", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");

    await page.getByTestId("timer-start-button").click();
    await expect(display).not.toHaveText("00:00:00.000", {
      timeout: 3000,
    });

    // Reset button should be visible while timer has elapsed time
    await expect(page.getByTestId("timer-reset-button")).toBeVisible();

    await page.getByTestId("timer-reset-button").click();
    await expect(display).toHaveText("00:00:00.000");

    // Reset button should disappear after timer is at zero
    await expect(page.getByTestId("timer-reset-button")).toHaveCount(0);
  });

  test("shows empty entries message initially", async ({
    page,
  }) => {
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
  });

  test("submitting an entry via the submit button adds a row to the table", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();

    const input = page.getByTestId("timer-input");
    await input.fill("First entry");
    await page.getByTestId("timer-submit-button").click();

    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("First entry");

    // Input should be cleared after submit
    await expect(input).toHaveValue("");
  });

  test("submitting an entry via Enter key adds a row to the table", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();

    const input = page.getByTestId("timer-input");
    await input.fill("Enter key entry");
    await input.press("Enter");

    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("Enter key entry");
  });

  test("submitting empty input does not add a row", async ({
    page,
  }) => {
    await page.getByTestId("timer-submit-button").click();
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
  });

  test("multiple entries appear in order", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();

    const input = page.getByTestId("timer-input");

    await input.fill("Alpha");
    await input.press("Enter");

    await input.fill("Beta");
    await input.press("Enter");

    await input.fill("Gamma");
    await input.press("Enter");

    const rows = page.getByTestId("timer-entry");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText("Alpha");
    await expect(rows.nth(1)).toContainText("Beta");
    await expect(rows.nth(2)).toContainText("Gamma");
  });

  test("entry timestamps are in HH:MM:SS.mmm format", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();

    // Wait a moment so the timestamp isn't 00:00:00.000
    await page.waitForTimeout(100);

    const input = page.getByTestId("timer-input");
    await input.fill("Timed entry");
    await input.press("Enter");

    const row = page.getByTestId("timer-entry").first();
    const rowText = await row.textContent();
    expect(rowText).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/);
  });
});
