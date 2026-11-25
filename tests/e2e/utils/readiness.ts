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
  await mapView.waitForDisplayed({timeout});
}
