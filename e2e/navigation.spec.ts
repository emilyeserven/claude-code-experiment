import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("renders the navigation bar with Home and About links", async ({
    page,
  }) => {
    await page.goto("/");

    const homeLink = page.getByRole("link", {
      name: "Home",
    });
    const aboutLink = page.getByRole("link", {
      name: "About",
    });

    await expect(homeLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
  });

  test("Home link is active on the home page", async ({
    page,
  }) => {
    await page.goto("/");

    const homeLink = page.getByRole("link", {
      name: "Home",
    });
    await expect(homeLink).toHaveClass(/active/);
  });

  test("navigates from Home to About", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", {
      name: "About",
    }).click();

    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText("Hello from About!")).toBeVisible();
  });

  test("navigates from About to Home", async ({
    page,
  }) => {
    await page.goto("/about");
    await page.getByRole("link", {
      name: "Home",
    }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("timer-display")).toBeVisible();
  });

  test("About link is active on the about page", async ({
    page,
  }) => {
    await page.goto("/about");

    const aboutLink = page.getByRole("link", {
      name: "About",
    });
    await expect(aboutLink).toHaveClass(/active/);
  });

  test("settings button is visible in the navigation bar", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("settings-trigger")).toBeVisible();
  });
});
