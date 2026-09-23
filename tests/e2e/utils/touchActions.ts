import type {ChainablePromiseElement} from 'webdriverio';

async function tapPoint(x: number, y: number) {
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: {pointerType: 'touch'},
      actions: [
        {type: 'pointerMove', origin: 'viewport', x, y, duration: 100},
        {type: 'pointerDown', button: 0},
        {type: 'pointerUp', button: 0},
      ],
    },
  ]);
  await driver.releaseActions();
  await driver.pause(300);
}

const IOS_RETURN_KEYS = ['return', 'Done', 'Go', 'Search', 'Next', 'Send'];

/**
 * Dismisses the software keyboard.
 *
 * iOS doesn't have`driver.hideKeyboard()`. Instead, pressing the return key
 * works for standard keyboards, but numeric keypads have no return key, so those
 * require a tap just above the keyboard's real frame. The frame has to be
 * measured, though, to work.
 */
export async function dismissKeyboard() {
  // The keyboard animates in asynchronously, so immediately after a setValue
  // it is not yet reported as shown.
  await waitForKeyboard(true);
  if (!(await driver.isKeyboardShown())) return;

  if (!driver.isIOS) {
    await driver.hideKeyboard();
    return;
  }

  try {
    await driver.execute('mobile: hideKeyboard', {keys: IOS_RETURN_KEYS});
  } catch {}

  await waitForKeyboard(false);
  if (!(await driver.isKeyboardShown())) return;

  const keyboard = await $('-ios class chain:**/XCUIElementTypeKeyboard');
  const {width} = await driver.getWindowSize();
  const {y} = await driver.getElementRect(await keyboard.elementId);
  await tapPoint(Math.round(width / 2), Math.max(1, y - 20));
  await waitForKeyboard(false);
}

async function waitForKeyboard(shown: boolean) {
  await driver
    .waitUntil(async () => (await driver.isKeyboardShown()) === shown, {
      timeout: 3000,
      interval: 150,
    })
    .catch(() => {});
}
