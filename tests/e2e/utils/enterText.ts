export async function enterPasscodeWithKeyEvents(passcode: string) {
  await browser.setTimeout({implicit: 1000});
  await driver.keys(passcode.split(''));
  await browser.setTimeout({implicit: 0});
}
