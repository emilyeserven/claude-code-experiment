import { expect, test } from "@playwright/test";

test.describe("Sessions", () => {
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
  });

  test("shows the default session name above the timer", async ({
    page,
  }) => {
    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
  });

  test("session name edit button is visible", async ({
    page,
  }) => {
    await expect(page.getByTestId("session-name-edit-button")).toBeVisible();
  });

  test("clicking edit button shows the name editor", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();

    await expect(page.getByTestId("session-name-input")).toBeVisible();
    await expect(page.getByTestId("session-name-input")).toHaveValue("Default Session");
    await expect(page.getByTestId("session-name-save")).toBeVisible();
    await expect(page.getByTestId("session-name-cancel")).toBeVisible();
  });

  test("renaming a session updates the displayed name", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();

    const input = page.getByTestId("session-name-input");
    await input.fill("My Custom Session");
    await page.getByTestId("session-name-save").click();

    await expect(page.getByTestId("session-name-text")).toHaveText("My Custom Session");
  });

  test("renaming a session persists across page reloads", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();

    const input = page.getByTestId("session-name-input");
    await input.fill("Persistent Name");
    await page.getByTestId("session-name-save").click();

    await page.reload();

    await expect(page.getByTestId("session-name-text")).toHaveText("Persistent Name");
  });

  test("cancelling a rename restores the original name", async ({
    page,
  }) => {
    await page.getByTestId("session-name-edit-button").click();

    const input = page.getByTestId("session-name-input");
    await input.fill("Should Not Save");
    await page.getByTestId("session-name-cancel").click();

    await expect(page.getByTestId("session-name-text")).toHaveText("Default Session");
  });

  test("delete session button is visible", async ({
    page,
  }) => {
    await expect(page.getByTestId("delete-session-button")).toBeVisible();
    await expect(page.getByTestId("delete-session-button")).toContainText("Delete Session");
  });

  test("clicking delete session shows a confirmation dialog", async ({
    page,
  }) => {
    await page.getByTestId("delete-session-button").click();

    await expect(page.getByText("Delete Session?")).toBeVisible();
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();
    await expect(page.getByTestId("cancel-delete-session")).toBeVisible();
    await expect(page.getByTestId("confirm-delete-session")).toBeVisible();
  });

  test("cancelling delete session preserves the session", async ({
    page,
  }) => {
    // Add an entry first
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");
    await input.fill("test entry");
    await input.press("Enter");

    await page.getByTestId("delete-session-button").click();
    await page.getByTestId("cancel-delete-session").click();

    // Entry should still be there
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);
  });

  test("confirming delete session clears entries and creates new default session", async ({
    page,
  }) => {
    // Add an entry first
    await page.getByTestId("timer-start-button").click();
    const input = page.getByTestId("timer-input");
    await input.fill("test entry");
    await input.press("Enter");
    await expect(page.getByTestId("timer-entry")).toHaveCount(1);

    await page.getByTestId("delete-session-button").click();
    await page.getByTestId("confirm-delete-session").click();

    // Should show empty state with a new default session
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
    const items = page.getByTestId("session-list-item");
    await items.first().click();

    // First session should still have its entry
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

  test("settings menu has a switch session button", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await expect(page.getByTestId("switch-session-trigger")).toBeVisible();
    await expect(page.getByTestId("switch-session-trigger")).toContainText("Switch Session");
  });

  test("switch session button opens session dialog", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("switch-session-trigger").click();

    await expect(page.getByText("Switch Session")).toBeVisible();
    await expect(page.getByText("Select a session or create a new one.")).toBeVisible();
    await expect(page.getByTestId("session-list-item")).toHaveCount(1);
    await expect(page.getByTestId("new-session-button")).toBeVisible();
  });

  test("can create a new session from the dialog", async ({
    page,
  }) => {
    await page.getByTestId("settings-trigger").click();
    await page.getByTestId("switch-session-trigger").click();
    await page.getByTestId("new-session-button").click();

    await page.getByTestId("new-session-name-input").fill("Work Session");
    await page.getByTestId("confirm-create-session").click();

    await expect(page.getByTestId("session-name-text")).toHaveText("Work Session");
  });
});
