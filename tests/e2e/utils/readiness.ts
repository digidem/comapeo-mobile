import {byResourceId} from './selectors';

/**
 * Waits until the map screen has rendered.
 *
 * Do not check for display of `MAIN.map-screen` itself. It is a full-screen container,
 * and it is covered by its own children, so iOS reports visible=false even though
 * the screen has rendered, so `toBeDisplayed()` on it can never pass on iOS. Also, the
 * appearance of the map screen can be really slow these days so this waits for it instead
 * of an untested driver pause.
 */
export async function waitForMapScreen(timeout = 30000) {
  const mapView = await $(byResourceId('MAIN.mapbox-map-view'));
  // On a fresh iOS install the map first shows the app's own location screen.
  // autoAcceptAlerts only answers the system prompt that Allow opens; Android
  // grants location up front, so this never appears there.
  const allowLocation = await $(byResourceId('MAP.location-allow-btn'));
  await driver.waitUntil(
    async () =>
      (await mapView.isDisplayed()) || (await allowLocation.isDisplayed()),
    {timeout, timeoutMsg: 'Neither the map nor the location screen appeared'},
  );
  if (await allowLocation.isDisplayed()) {
    await allowLocation.click();
    // autoAcceptAlerts leaves this system prompt open on BrowserStack's iPhones
    const promptShown = await driver
      .waitUntil(
        () =>
          driver.getAlertText().then(
            () => true,
            () => false,
          ),
        {
          timeout: 10000,
        },
      )
      .catch(() => false);
    if (promptShown) {
      await driver.execute('mobile: alert', {
        action: 'accept',
        buttonLabel: 'Allow While Using App',
      });
    }
    await mapView.waitForDisplayed({timeout});
  }
}
