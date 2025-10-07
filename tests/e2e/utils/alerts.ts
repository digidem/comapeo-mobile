export async function handleGPSAlert(): Promise<void> {
  try {
    const text = await driver.getAlertText();
    if (text.includes('No GPS signal') || text.includes('Weak GPS signal')) {
      try {
        const saveButton = await $(
          'android=new UiSelector().text("SAVE").className("android.widget.Button")',
        );
        await saveButton.waitForDisplayed({timeout: 2000});
        await saveButton.click();
        return;
      } catch {
        await driver.execute('mobile:acceptAlert', {buttonLabel: 'SAVE'});
      }
    }
  } catch (err) {
    console.log('No RN Alert dialog was found.');
  }
}
