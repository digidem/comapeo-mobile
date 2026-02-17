export async function handleGPSAlert(): Promise<void> {
  try {
    const saveButton = await $(
      'android=new UiSelector().text("SAVE").className("android.widget.Button")',
    );
    if (await saveButton.isDisplayed()) {
      await saveButton.click();
    }
  } catch {
    console.log('No RN Alert dialog was found.');
  }
}
