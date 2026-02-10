import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("renders nav bar with Home and Capture links, and settings button", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", {
      name: "Home",
    })).toBeVisible();
    await expect(page.getByRole("link", {
      name: "Capture",
    })).toBeVisible();
    await expect(page.getByTestId("settings-trigger")).toBeVisible();
  });

  test("active link styling matches the current route", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("link", {
      name: "Home",
    })).toHaveClass(/active/);

    await page.goto("/capture");
    await expect(page.getByRole("link", {
      name: "Capture",
    })).toHaveClass(/active/);
  });

  test("navigates between Home and Capture pages", async ({
    page,
  }) => {
    await page.goto("/");

    // Home -> Capture
    await page.getByRole("link", {
      name: "Capture",
    }).click();
    await expect(page).toHaveURL(/\/capture/);
    await expect(page.getByTestId("capture-heading")).toBeVisible();

    // Capture -> Home
    await page.getByRole("link", {
      name: "Home",
    }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("timer-display")).toBeVisible();
  });
});
