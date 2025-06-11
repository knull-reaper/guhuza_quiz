import { test, expect, Page } from "@playwright/test";

const QUIZ_LEVEL_URL = "/quiz/1";
const LEADERBOARD_URL = "/leaderboard";

async function login(page: Page, username?: string, password?: string) {
  console.log(
    "Login function called (placeholder) - implement actual login steps."
  );
}

test.describe("Quiz Flow E2E Tests", () => {
  test.beforeEach(async ({ page }) => {});

  test("should handle question timer expiry", async ({ page }) => {
    await page.goto(QUIZ_LEVEL_URL);

    const questionTextSelector = ".question-text";
    const optionsSelector = ".question-option";
    const scoreDisplaySelector = ".score-display";
    const initialScore = await page.locator(scoreDisplaySelector).textContent();

    await expect(page.locator(questionTextSelector)).toBeVisible();

    await page.waitForTimeout(16000);

    test.skip(
      true,
      "Test logic for timer expiry needs to be implemented with actual selectors and game flow."
    );
  });

  test("should award streak bonus for consecutive correct answers", async ({
    page,
  }) => {
    await page.goto(QUIZ_LEVEL_URL);

    test.skip(true, "Test logic for streak bonus needs to be implemented.");
  });

  test("should reflect score changes on the leaderboard", async ({ page }) => {
    await page.goto(QUIZ_LEVEL_URL);

    await page.goto(LEADERBOARD_URL);

    await page.waitForTimeout(11000);

    test.skip(
      true,
      "Test logic for leaderboard update needs to be implemented."
    );
  });
});
