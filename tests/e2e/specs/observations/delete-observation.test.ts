import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Observations - Delete Observation Flow', () => {
  it('should open "Fungi" observation and verify it is editable', async () => {
    const fungiItem = await $(byTextMatches('Fungi'));
    await fungiItem.click();

    await expect($(byTextMatches('Fungi'))).toBeDisplayed();
    const deleteBtn = await $(byText('Delete'));
    const observationScroll = await $(
      'android=new UiSelector().scrollable(true)',
    );
    let canScrollMore = true;
    while (canScrollMore) {
      canScrollMore = Boolean(
        await driver.execute('mobile: scrollGesture', {
          elementId: observationScroll.elementId,
          direction: 'down',
          percent: 1.0,
        }),
      );
    }
    await expect($(byText('Share'))).toBeDisplayed();
    await expect(deleteBtn).toBeDisplayed();
  });

  it('should open delete bottom sheet and then cancel', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Delete observation?'))).toBeDisplayed();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();

    await expect($(byTextMatches('Fungi'))).toBeDisplayed();
  });

  it('should delete the observation and confirm it is gone', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Delete observation?'))).toBeDisplayed();
    const confirmDelete = await $(byResourceId('OBS.confirm-delete-btn'));
    await confirmDelete.click();

    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    checkForElementGone(byTextMatches('Fungi'));
    await $('~Go to map.').click();
  });
});
