import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {testFlags} from '../../utils/testFlags';

describe('Remote Archive - Remove Flow', () => {
  const tests = testFlags.remoteArchiveAddFailed ? describe.skip : describe;
  tests('Removal of Archive', () => {
    it('navigates to remote archive details screen', async () => {
      await expect($(byTextMatches('Remote Archive \\| ON'))).toBeDisplayed();
      await $(byText('View Details')).click();

      await expect($(byTextMatches('Remote Archive is On'))).toBeDisplayed();
      await expect($(byTextMatches('Remove Server'))).toBeDisplayed();

      const removeButton = await $(byText('Remove Server'));
      await removeButton.click();
    });

    it('confirms removal and verifies remote archive is off', async () => {
      await expect($(byTextMatches('Remove'))).toBeDisplayed();
      await expect(
        $(byTextMatches('This will stop archiving')),
      ).toBeDisplayed();

      const confirmRemove = await $(byTextMatches('Remove Archive'));
      await confirmRemove.click();

      await expect($(byTextMatches('Remote Archive is Off'))).toBeDisplayed();
      await expect($(byText('Add Remote Archive'))).toBeDisplayed();
      const backButton = await $(byResourceId('MAIN.header-back-btn'));
      await backButton.click();
      await expect($(byTextMatches('Remote Archive \\| OFF'))).toBeDisplayed();
    });
  });

  after(async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Close Menu').click();
  });
});
