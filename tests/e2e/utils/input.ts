import type {ChainablePromiseElement} from 'webdriverio';

/**
 * Types `value` into a text input, checking it actually worked.
 *
 * On iOS, typing into a text box that has only just appeared often does
 * nothing at all and reports success anyway, even though the box is empty.
 *
 * So: tap the box to wake it up, type, then read it back and retry until the
 * value is really there.
 */
export async function setInputValue(
  chainableElem: ChainablePromiseElement,
  value: string,
) {
  const el = await chainableElem;
  await el.waitForDisplayed();

  await driver.waitUntil(
    async () => {
      await el.click();
      await el.setValue(value);
      return (await el.getText()) === value;
    },
    {
      timeout: 15000,
      interval: 400,
      timeoutMsg: `Could not set input value to "${value}"`,
    },
  );
}
