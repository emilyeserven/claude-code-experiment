import { expect, test } from "@playwright/test";

test.describe("Sessions", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("timer-sessions");
      localStorage.removeItem("timer-active-session");
    });
    await page.reload();
  });

  test("shows default session with edit and delete buttons", async ({
    page,
  }) => {
    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
    await expect(page.getByTestId("session-name-edit-button")).toBeVisible();
    await expect(page.getByTestId("delete-session-button")).toBeVisible();
    await expect(page.getByTestId("delete-session-button")).toContainText("Delete Session");
  });

  test("renaming a session updates the name and persists across reloads", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();

    const input = page.getByTestId("session-name-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveValue("Default Session");
    await expect(page.getByTestId("session-name-save")).toBeVisible();
    await expect(page.getByTestId("session-name-cancel")).toBeVisible();

    await input.fill("My Custom Session");
    await page.getByTestId("session-name-save").click();
    await expect(page.getByTestId("session-name-text")).toHaveText("My Custom Session");

    // Verify persistence
    await page.reload();
    await expect(page.getByTestId("session-name-text")).toHaveText("My Custom Session");
  });

  test("cancelling a rename restores the original name", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();
    await page.getByTestId("session-name-input").fill("Should Not Save");
    await page.getByTestId("session-name-cancel").click();
    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
  });

  test("delete session shows confirmation and can be cancelled", async ({
    page,
  }) => {
    // Add an entry first
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");
    await input.fill("test entry");
    await input.press("Enter");

    await page.getByTestId("delete-session-button").click();
    await expect(page.getByText("Delete Session?")).toBeVisible();
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();
    await expect(page.getByTestId("cancel-delete-session")).toBeVisible();
    await expect(page.getByTestId("confirm-delete-session")).toBeVisible();

    // Cancel preserves the session
    await page.getByTestId("cancel-delete-session").click();
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
  });

  test("confirming delete clears entries and creates new default session", async ({
    page,
  }) => {
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");
    await input.fill("test entry");
    await input.press("Enter");
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);

    await page.getByTestId("delete-session-button").click();
    await page.getByTestId("confirm-delete-session").click();

    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();
  });

  test("entries are grouped per session", async ({
    page,
  }) => {
    // Add entries to default session
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");
    await input.fill("Session 1 Entry");
    await input.press("Enter");
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);

    // Create a new session via settings
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("switch-session-trigger").click();
    await page.getByTestId("new-session-button").click();
    await page.getByTestId("new-session-name-input").fill("Second Session");
    await page.getByTestId("confirm-create-session").click();

    // New session should be empty
    await expect(page.getByTestId("session-name-text")).toHaveText("Second Session");
    await expect(page.getByTestId("timer-entries-empty")).toBeVisible();

    // Add entry to the new session
    await input.fill("Session 2 Entry");
    await input.press("Enter");
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("Session 2 Entry");

    // Switch back to first session
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("switch-session-trigger").click();
    await page.getByTestId("session-list-item").first().click();

    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
    await expect(page.getByTestId("timer-entry").first()).toContainText("Session 1 Entry");
  });
});

test.describe("Session switcher dialog", () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("timer-sessions");
      localStorage.removeItem("timer-active-session");
    });
    await page.reload();
  });

  test("switch session button opens dialog and can create a new session", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await expect(page.getByTestId("switch-session-trigger")).toBeVisible();
    await expect(page.getByTestId("switch-session-trigger")).toContainText("Switch Session");

    await page.getByTestId("switch-session-trigger").click();
    await expect(page.getByRole("heading", {
      name: "Switch Session",
    })).toBeVisible();
    await expect(page.getByText("Select a session or create a new one.")).toBeVisible();
    await expect(page.getByTestId("session-list-item")).toHaveCount(1);
    await expect(page.getByTestId("new-session-button")).toBeVisible();

    // Create new session
    await page.getByTestId("new-session-button").click();
    await page.getByTestId("new-session-name-input").fill("Work Session");
    await page.getByTestId("confirm-create-session").click();

    await expect(page.getByTestId("session-name-text")).toHaveText("Work Session");
  });
});
