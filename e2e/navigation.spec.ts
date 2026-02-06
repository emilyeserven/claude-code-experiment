import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("renders nav bar with Home and About links, and settings button", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", {
      name: "Home",
    })).toBeVisible();
    await expect(page.getByRole("link", {
      name: "About",
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

    await page.goto("/about");
    await expect(page.getByRole("link", {
      name: "About",
    })).toHaveClass(/active/);
  });

  test("navigates between Home and About pages", async ({
    page,
  }) => {
    await page.goto("/");

    // Home -> About
    await page.getByRole("link", {
      name: "About",
    }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText("Hello from About!")).toBeVisible();

    // About -> Home
    await page.getByRole("link", {
      name: "Home",
    }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("timer-display")).toBeVisible();
  });
});
