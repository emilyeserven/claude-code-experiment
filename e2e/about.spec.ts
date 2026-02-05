import { expect, test } from "@playwright/test";

test.describe("About page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("displays the about heading", async ({ page }) => {
    await expect(page.getByText("Hello from About!")).toBeVisible();
  });

  test("shows a pending status while data is loading", async ({ page }) => {
    // The status message should show either Pending or loaded depending on timing
    const status = page.getByTestId("status-message");
    await expect(status).toBeVisible();
  });

  test("shows loaded status when the API responds successfully", async ({ page }) => {
    // Mock the API response so the test doesn't depend on the middleware
    await page.route("**/api", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ item: "mocked item", fromEnv: "mocked env" }),
      });
    });

    await page.goto("/about");

    const status = page.getByTestId("status-message");
    await expect(status).toContainText("loaded!", { timeout: 10_000 });
    await expect(page.getByText("mocked item")).toBeVisible();
  });

  test("shows error status when the API request fails", async ({ page }) => {
    await page.route("**/api", (route) => {
      return route.fulfill({ status: 500 });
    });

    await page.goto("/about");

    const status = page.getByTestId("status-message");
    // TanStack Query will retry, but eventually error
    await expect(status).toContainText("Erroring", { timeout: 30_000 });
  });
});
