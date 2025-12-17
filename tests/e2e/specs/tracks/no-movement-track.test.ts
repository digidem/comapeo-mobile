import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import type {ChainablePromiseElement} from 'webdriverio';

async function tapElement(chainableElem: ChainablePromiseElement) {
  const el = await chainableElem;
  const elementId = await el.elementId;
  const rect = await driver.getElementRect(elementId);
  const xCoord = Math.round(rect.x + rect.width / 2);
  const yCoord = Math.round(rect.y + rect.height / 2);

  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: {pointerType: 'touch'},
      actions: [
        {
          type: 'pointerMove',
          origin: 'viewport',
          x: xCoord,
          y: yCoord,
          duration: 0,
        },
        {type: 'pointerDown', button: 0},
        {type: 'pause', duration: 100},
        {type: 'pointerUp', button: 0},
      ],
    },
  ]);
  await driver.releaseActions();
}

describe('Tracks - No movement flow', () => {
  it('opens discard modal and chooses to continue editing', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();

    const stopTracksBtn = await $(byTextMatches('Stop Tracks'));
    await stopTracksBtn.waitForDisplayed({timeout: 10000});
    await tapElement(stopTracksBtn);

    await expect($(byTextMatches('No Track Recorded'))).toBeDisplayed();
    await expect(
      $(byTextMatches("You didn't move beyond one meter.")),
    ).toBeDisplayed();

    const continueBtn = await $(byTextMatches('Continue Recording'));
    await continueBtn.waitForDisplayed({timeout: 10000});
    await tapElement(continueBtn);

    const stopTracksBtn2 = await $(byTextMatches('Stop Tracks'));
    await stopTracksBtn2.waitForDisplayed({timeout: 10000});
    await tapElement(stopTracksBtn2);

    const exitButton = await $(byTextMatches('Exit Tracks'));
    await exitButton.waitForDisplayed({timeout: 10000});
    await tapElement(exitButton);

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
