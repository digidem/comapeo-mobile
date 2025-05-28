import {expect} from '@wdio/globals';
import {describe, it, before} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Remote Archive - Add Error Flow', () => {
  before(async () => {
    await $('~Open Menu').click();
    await $(byText('View')).click();
  });

  it('navigates to Remote Archive screen and opens add screen', async () => {
    await expect($(byTextMatches('Remote Archive \\| OFF'))).toBeDisplayed();
    await $(byText('View Details')).click();
    await expect($(byText('Add Remote Archive'))).toBeDisplayed();

    const addArchiveBtn = await $(byText('Add Remote Archive'));
    await addArchiveBtn.click();
  });

  it('shows error when invalid URL is submitted', async () => {
    const urlInput = await $(byResourceId('RA.url-inp'));
    await urlInput.setValue('example.com');
    await $(byResourceId('OBS.edit-save-btn')).click();
    await expect($(byTextMatches('example.com'))).toBeDisplayed();

    await expect($(byTextMatches('Invalid URL'))).toBeDisplayed();
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    await expect($(byTextMatches('Remote Archive is Off'))).toBeDisplayed();
    await backButton.click();
    await expect($(byTextMatches('Remote Archive \\| OFF'))).toBeDisplayed();
  });
});
