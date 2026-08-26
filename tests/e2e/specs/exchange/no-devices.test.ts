import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Screen No Devices', () => {
  it('should navigate to exchange screen and verify content for no devices available', async () => {
    await $('~Open Menu').click();
    const exchangeBtn = await $(byText('Exchange'));
    await exchangeBtn.click();

    const screenHeader = await $(byText('Exchange'));
    await expect(screenHeader).toBeDisplayed();
    await expect($(byResourceId('wifi-icon'))).toBeDisplayed();

    await expect($(byTextMatches('No devices found.'))).toBeDisplayed();
    const startBtn = await $(byResourceId('EXCHANGE.start-btn'));
    await expect(startBtn).toBeDisplayed();
    await expect(startBtn).not.toBeEnabled();
  });
});
