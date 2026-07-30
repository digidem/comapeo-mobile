import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Settings for Everything', () => {
  it('should have exchange everything set to defaul', async () => {
    await expect($(byTextMatches('Exchange Everything'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Full size photos and audio')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Uses more storage'))).toBeDisplayed();
  });

  it('should have exchange everything selected', async () => {
    const changeSettingsBtn = await $(byTextMatches('Change Settings'));
    await changeSettingsBtn.click();
    await expect(
      $(byResourceId('EXCHANGE.radio-selected-everything')),
    ).toBeDisplayed();
    const closeButtonSelector = byResourceId('EXCHANGE.settings-close');
    await $(closeButtonSelector).click();
  });
});
