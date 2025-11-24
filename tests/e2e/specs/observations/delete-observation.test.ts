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
    await deleteBtn.scrollIntoView();
    await expect($(byText('Share'))).toBeDisplayed();
    await expect(deleteBtn).toBeDisplayed();
  });

  it('should open delete dialog and then cancel', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Delete observation\\?'))).toBeDisplayed();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();

    await expect($(byTextMatches('Fungi'))).toBeDisplayed();
  });

  it('should delete the observation and confirm it is gone', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    const confirmDelete = await $(byTextMatches('Yes, delete'));
    await confirmDelete.click();

    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    checkForElementGone(byTextMatches('Fungi'));
    await $('~Go to map.').click();
  });
});
