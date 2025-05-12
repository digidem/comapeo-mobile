export async function checkForElementGone(
  selector: string,
  timeout = 2000,
  interval = 100,
) {
  browser.setTimeout({implicit: 0});

  let elapsed = 0;
  while (elapsed < timeout) {
    const elems = await $$(selector);
    if ((await elems.length) === 0) break;
    await driver.pause(interval);
    elapsed += interval;
  }

  await browser.setTimeout({implicit: 0});
  if (elapsed >= timeout) {
    throw new Error(`Element ${selector} not gone after ${timeout}ms`);
  }
}
