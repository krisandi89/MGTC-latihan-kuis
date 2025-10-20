const { test, expect } = require('@playwright/test');

test.describe('Admin Logout Bug Verification', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('file://' .replace('file://', 'file:///') + __dirname + '/../index.html');
  });

  test('Admin controls should be hidden on leaderboard after admin logs out', async () => {
    // 1. Admin logs in
    await page.click('button:has-text("Login Admin")');
    await page.fill('#admin-username', 'admin');
    await page.fill('#admin-password', 'password123');
    await page.locator('#admin-login-page button:has-text("Login")').click();
    await expect(page.locator('#admin-controls')).toBeVisible();

    // 2. Admin logs out
    await page.click('button:has-text("Logout")');
    await expect(page.locator('#welcome-page')).toBeVisible();

    // 3. Simulate navigating directly to leaderboard page
    await page.evaluate(() => showPage('leaderboard-page'));

    // 4. Verify admin controls are hidden. This should fail on the original code.
    await expect(page.locator('#admin-controls')).toBeHidden();
  });
});
