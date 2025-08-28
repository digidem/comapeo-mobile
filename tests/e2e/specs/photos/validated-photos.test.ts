import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';

describe('Photo - show validated photo', () => {
  it('should open observation with photo', async () => {
    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();
    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~View saved photo.');
        const count = await thumbs.length;
        return count === 1;
      },
      {
        timeout: 5000,
      },
    );

    const thumbnails = await $$('~View saved photo.');
    expect(thumbnails.length).toBe(1);
  });

  it('should open the photo modal when thumbnail clicked', async () => {
    const thumbnails = await $$('~View saved photo.');
    expect(thumbnails.length).toBe(1);
    await thumbnails[0].click();
    await expect($(byText('Photo Info'))).toBeDisplayed();
    await expect($(byText('Validated by CoMapeo'))).toBeDisplayed();
  });

  it('should show validated accordian', async () => {
    const validatedByAccordion = await $(byText('Validated by CoMapeo'));
    const verifiedMessage = await $(
      byTextMatches('This is a verified unaltered original.'),
    );

    await expect(verifiedMessage).not.toBeDisplayed();

    await validatedByAccordion.scrollIntoView();

    await validatedByAccordion.click();

    await verifiedMessage.scrollIntoView();

    await expect(verifiedMessage).toBeDisplayed();

    const attachedAtMessage = await $(
      byTextMatches('Attached at the time of the observation'),
    );

    await attachedAtMessage.scrollIntoView();

    await expect(attachedAtMessage).toBeDisplayed();

    const attachedDistance = await $(
      byTextMatches('^Attached \\d+(\\.\\d+)? m from observation$'),
    );

    await attachedDistance.scrollIntoView();

    await expect(attachedDistance).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await driver.pause(1000);
  });
});
