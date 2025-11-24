import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Observation - Metadata View Flow', () => {
  it('should open Observation from list and view metadata via date bar', async () => {
    const obsItem = await $(byTextMatches('Tree'));
    await obsItem.click();

    await expect($(byTextMatches('Tree'))).toBeDisplayed();

    const dateBar = await $('~Open Observation Metadata');
    await dateBar.click();

    await expect($(byTextMatches('Observation Metadata'))).toBeDisplayed();
    await expect($(byTextMatches('Latitude'))).toBeDisplayed();
    await expect($(byTextMatches('Longitude'))).toBeDisplayed();
    await expect($(byTextMatches('Accuracy'))).toBeDisplayed();
    await expect($(byTextMatches('Altitude'))).toBeDisplayed();
    await expect($(byTextMatches('Speed'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
  });

  it('should view metadata via GPS bubble tap on map', async () => {
    const gpsBubble = await $('~Open observation metadata via map pin');
    await gpsBubble.click();

    await expect($(byTextMatches('Observation Metadata'))).toBeDisplayed();
    await expect($(byTextMatches('Accuracy'))).toBeDisplayed();

    const shareBtn = await $(byTextMatches('Share'));
    await expect(shareBtn).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await driver.pause(1000);
    await backBtn.click();
  });
});
