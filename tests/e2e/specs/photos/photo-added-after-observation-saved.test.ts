import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Photo - add photo to existing observation', () => {
  it('should edit observation on edit icon click', async () => {
    const editBtn = await $(byResourceId('editButton'));
    await editBtn.click();

    await expect($(byTextMatches('Edit Observation'))).toBeDisplayed();
  });

  it('should add photo to existing observation', async () => {
    const addPhotoBtn = await $(byResourceId('OBS.add-photo-btn'));
    await addPhotoBtn.click();
    await expect($(byResourceId('MAIN.camera-scrn'))).toBeDisplayed();
    const takePhotoBtn = await $(byResourceId('addButtonCamera'));
    ('addButtonCamera');

    await takePhotoBtn.click();
    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~View draft photo.');
        const count = await thumbs.length;
        return count === 1;
      },
      {
        timeout: 5000,
      },
    );
    const draftThumbnails = await $$('~View draft photo.');

    await expect(draftThumbnails.length).toBe(1);

    const attachedThumbnails = await $$('~View saved photo.');
    await expect(attachedThumbnails.length).toBe(1);
  });

  it('should open new photo in draft photo modal', async () => {
    const draftThumbnails = await $$('~View draft photo.');
    await draftThumbnails[0].click();
    await expect(await $(byTextMatches('Photo Info'))).toBeDisplayed();
    await expect(await $(byTextMatches('Delete Photo'))).toBeDisplayed();

    await expect($(byTextMatches('Validated by CoMapeo'))).not.toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await driver.pause(1000);
  });

  it('should show previously added photo as attached photo', async () => {
    const attachedThumbnails = await $$('~View saved photo.');
    await attachedThumbnails[0].click();

    const validatedByAccordion = await $(byTextMatches('Validated by CoMapeo'));
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

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
  });

  it('should save observation and show 2 verified photos', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);

    const attachedThumbnails = await $$('~View saved photo.');
    await expect(attachedThumbnails.length).toBe(2);
  });

  it('should open first photo and show photo was takend at time of observation', async () => {
    const attachedThumbnails = await $$('~View saved photo.');
    await attachedThumbnails[0].click();

    const validatedByAccordion = await $(byTextMatches('Validated by CoMapeo'));

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

  it('should open second photo and show photo create After observation', async () => {
    const attachedThumbnails = await $$('~View saved photo.');

    await attachedThumbnails[1].click();

    const validatedByAccordion = await $(byTextMatches('Validated by CoMapeo'));

    const verifiedMessage = await $(
      byTextMatches('This is a verified unaltered original.'),
    );

    await expect(verifiedMessage).not.toBeDisplayed();

    await validatedByAccordion.scrollIntoView();

    await validatedByAccordion.click();

    await verifiedMessage.scrollIntoView();

    await expect(verifiedMessage).toBeDisplayed();

    const attachedAtMessage = await $(
      byTextMatches('^Attached \\d+(\\.\\d+)? sec after observation$'),
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
  });
});
