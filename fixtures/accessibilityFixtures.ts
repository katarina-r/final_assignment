import { Page, expect } from '@playwright/test';

// Helper function to check focus
export async function checkFocus(page: Page, locator, expected = true) {
    await locator.waitFor({ state: 'attached' });

    const hasFocus = await locator.evaluate((el) => el === document.activeElement);
    expect(hasFocus).toBe(expected);
}