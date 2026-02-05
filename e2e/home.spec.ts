import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
  });

  test("displays the welcome heading", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", {
      name: "Welcome Home!",
    })).toBeVisible();
  });

  test("shows the timer at 00:00:00.000", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");
    await expect(display).toHaveText("00:00:00.000");
  });

  test("has start, stop, and reset timer buttons", async ({
    page,
  }) => {
    await expect(page.getByTestId("timer-start-button")).toBeVisible();
    await expect(page.getByTestId("timer-stop-button")).toBeVisible();
    await expect(page.getByTestId("timer-reset-button")).toBeVisible();
  });

  test("start button begins the timer and stop button pauses it", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");
    await expect(display).toHaveText("00:00:00.000");

    await page.getByTestId("timer-start-button").click();

    // Wait for timer to advance past zero
    await expect(display).not.toHaveText("00:00:00.000", {
      timeout: 3000,
    });

    await page.getByTestId("timer-stop-button").click();

    // Record the time after stopping
    const stoppedTime = await display.textContent();

    // Wait a moment and verify the timer is no longer advancing
    await page.waitForTimeout(200);
    await expect(display).toHaveText(stoppedTime!);
  });

  test("reset button returns the timer to zero", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");

    await page.getByTestId("timer-start-button").click();
    await expect(display).not.toHaveText("00:00:00.000", {
      timeout: 3000,
    });

    await page.getByTestId("timer-reset-button").click();
    await expect(display).toHaveText("00:00:00.000");
  });

  test("start button is disabled while timer is running", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();
    await expect(page.getByTestId("timer-start-button")).toBeDisabled();

    await page.getByTestId("timer-stop-button").click();
    await expect(page.getByTestId("timer-start-button")).toBeEnabled();
  });

  test("stop button is disabled while timer is not running", async ({
    page,
  }) => {
    await expect(page.getByTestId("timer-stop-button")).toBeDisabled();

    await page.getByTestId("timer-start-button").click();
    await expect(page.getByTestId("timer-stop-button")).toBeEnabled();
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
