import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
  });

  test("shows the timer at 00:00:00.000 with only a start button", async ({
    page,
  }) => {
    await expect(page.getByTestId("timer-display")).toHaveText("00:00:00.000");
    await expect(page.getByTestId("timer-start-button")).toBeVisible();
    await expect(page.getByTestId("timer-stop-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-reset-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
  });

  test("start begins the timer, stop pauses it, reset returns to zero", async ({
    page,
  }) => {
    const display = page.getByTestId("timer-display");

    // Start
    await page.getByTestId("timer-start-button").click();
    await expect(page.getByTestId("timer-start-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-stop-button")).toBeVisible();
    await expect(display).not.toHaveText("00:00:00.000", {
      timeout: 3000,
    });

    // Stop
    await page.getByTestId("timer-stop-button").click();
    await expect(page.getByTestId("timer-stop-button")).toHaveCount(0);
    await expect(page.getByTestId("timer-start-button")).toBeVisible();
    const stoppedTime = await display.textContent();
    if (stoppedTime === null) throw new Error("display had no textContent");
    await page.waitForTimeout(200);
    await expect(display).toHaveText(stoppedTime);

    // Reset
    await expect(page.getByTestId("timer-reset-button")).toBeVisible();
    await page.getByTestId("timer-reset-button").click();
    await expect(display).toHaveText("00:00:00.000");
    await expect(page.getByTestId("timer-reset-button")).toHaveCount(0);
  });

  test("submitting entries via button and Enter key adds rows to the table", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");

    // Submit via button
    await input.fill("First entry");
    await page.getByTestId("timer-submit-button").click();
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("First entry");
    await expect(input).toHaveValue("");

    // Submit via Enter
    await input.fill("Second entry");
    await input.press("Enter");
    await expect(page.getByTestId("timer-entry")).toHaveCount(2);
    await expect(page.getByTestId("timer-entry").nth(0)).toContainText("First entry");
    await expect(page.getByTestId("timer-entry").nth(1)).toContainText("Second entry");
  });

  test("submitting empty input does not add a row", async ({
    page,
  }) => {
    await page.getByTestId("timer-submit-button").click();
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
  });

  test("entry timestamps are in HH:MM:SS.mmm format", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();
    await page.waitForTimeout(100);

    const input = page.getByTestId("timer-input");
    await input.fill("Timed entry");
    await input.press("Enter");

    const rowText = await page.getByTestId("timer-entry").first().textContent();
    expect(rowText).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/);
  });
});
