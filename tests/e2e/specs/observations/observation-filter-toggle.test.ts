import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Observations - Filter Toggle', () => {
  it('should show filter toggle on observations list', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-toggle'))).toBeDisplayed();
  });

  it('should default to All being active and Just You inactive', async () => {
    await expect($(byResourceId('OBS.filter-all-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-mine-inactive'))).toBeDisplayed();
  });

  it('should mark Just You active when tapped', async () => {
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();

    const mineBtn = $(byResourceId('OBS.filter-mine-inactive'));
    await mineBtn.click();

    await expect($(byResourceId('OBS.filter-mine-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-all-inactive'))).toBeDisplayed();

    // Same observations still visible — all were created on this device
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
  });

  it('should mark All active when tapped and show same observations', async () => {
    const allBtn = $(byResourceId('OBS.filter-all-inactive'));
    await allBtn.click();

    await expect($(byResourceId('OBS.filter-all-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-mine-inactive'))).toBeDisplayed();

    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
    await $('~Go to map.').click();
  });
});
