/**
 * Dismisses the "save without GPS" confirmation.
 *
 * Android renders this as an RN Alert, whose button label is uppercased by the
 * platform. iOS renders a native UIAlertController with the label as written,
 * and `autoAcceptAlerts: true` usually dismisses it before we get here — so on
 * iOS this is expected to be a no-op most of the time.
 */
export async function handleGPSAlert(): Promise<void> {
  const selector = driver.isIOS
    ? "-ios predicate string:type == 'XCUIElementTypeButton' AND label == 'Save'"
    : 'android=new UiSelector().text("SAVE").className("android.widget.Button")';

  try {
    const saveButton = await $(selector);
    if (await saveButton.isDisplayed()) {
      await saveButton.click();
    }
  } catch {
    console.log('No GPS save alert was found.');
  }
}
