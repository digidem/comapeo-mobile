import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';

describe('Observations - Delete Observation Flow', () => {
  it('should open "Threat" observation and verify it is editable', async () => {
    const threatItem = await $(byTextMatches('Threat'));
    await threatItem.click();

    await expect($(byTextMatches('Threat'))).toBeDisplayed();
    await expect($(byText('Share'))).toBeDisplayed();
    await expect($(byText('Delete'))).toBeDisplayed();
  });

  it('should open delete dialog and then cancel', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Delete observation\\?'))).toBeDisplayed();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();

    await expect($(byTextMatches('Threat'))).toBeDisplayed();
  });

  it('should delete the observation and confirm it is gone', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    const confirmDelete = await $(byTextMatches('Yes, delete'));
    await confirmDelete.click();

    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byTextMatches('Threat'))).not.toBeDisplayed();
    await $('~Go to map.').click();
  });
});
