import { expect, test } from "@playwright/test";

test.describe("Capture page", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/capture");
  });

  test("displays the capture heading and description", async ({
    page,
  }) => {
    await expect(page.getByTestId("capture-heading")).toBeVisible();
    await expect(page.getByTestId("capture-description")).toBeVisible();
  });

  test("shows directions and prompt input fields", async ({
    page,
  }) => {
    await expect(page.getByTestId("directions-input")).toBeVisible();
    await expect(page.getByTestId("prompt-input")).toBeVisible();
    await expect(page.getByTestId("capture-submit")).toBeVisible();
  });

  test("saves an entry when the form is submitted", async ({
    page,
  }) => {
    await page.getByTestId("directions-input").fill("Test AI directions");
    await page.getByTestId("prompt-input").fill("Test prompt");
    await page.getByTestId("capture-submit").click();

    await expect(page.getByTestId("entries-section")).toBeVisible();
    await expect(page.getByTestId("entry-0-directions")).toHaveText("Test AI directions");
    await expect(page.getByTestId("entry-0-prompt")).toHaveText("Test prompt");
  });

  test("clears the form after submission", async ({
    page,
  }) => {
    await page.getByTestId("directions-input").fill("Some directions");
    await page.getByTestId("prompt-input").fill("Some prompt");
    await page.getByTestId("capture-submit").click();

    await expect(page.getByTestId("directions-input")).toHaveValue("");
    await expect(page.getByTestId("prompt-input")).toHaveValue("");
  });

  test("clears all entries when Clear All is clicked", async ({
    page,
  }) => {
    await page.getByTestId("directions-input").fill("Directions to clear");
    await page.getByTestId("prompt-input").fill("Prompt to clear");
    await page.getByTestId("capture-submit").click();

    await expect(page.getByTestId("entries-section")).toBeVisible();

    await page.getByTestId("clear-all-button").click();

    await expect(page.getByTestId("entries-section")).not.toBeVisible();
  });
});
