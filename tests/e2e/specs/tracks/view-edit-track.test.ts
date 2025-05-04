import {expect} from '@wdio/globals';
import {describe, it, before} from 'mocha';
import {byTextMatches, byResourceId, byText} from '../../utils/selectors';

describe('Tracks - View and Edit Saved Track', () => {
  before(async () => {
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();

    const trackItem = await $(byText('Track'));
    await expect(trackItem).toBeDisplayed();
    await trackItem.click();
  });

  it('shows the saved track with expected observations', async () => {
    await expect($(byText('3'))).toBeDisplayed();

    const observationAccordion = await $(byText('Observations'));
    await expect(observationAccordion).toBeDisplayed();
    await observationAccordion.click();

    const clay = await $(byTextMatches('Clay'));
    const gatheringSite = await $(byTextMatches('Gathering Site'));
    const lake = await $(byTextMatches('Lake'));

    await expect(clay).toBeDisplayed();
    await expect(gatheringSite).toBeDisplayed();
    await expect(lake).toBeDisplayed();
  });

  it('opens edit screen and modifies the description', async () => {
    const editBtn = await $(byResourceId('editButton'));
    await editBtn.click();

    const notesField = await $(byResourceId('trackDescriptionField'));
    await notesField.click();
    await notesField.setValue('This is a test edit of the track description.');

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();

    await expect(
      $(byTextMatches('This is a test edit of the track description.')),
    ).toBeDisplayed();

    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });
  it('displays the associated Track in the Observation Detail View', async () => {
    const lakeObs = await $(byTextMatches('Lake'));
    await lakeObs.click();

    const trackAccordian = await $(byTextMatches('Track'));
    await expect(trackAccordian).toBeDisplayed();

    await trackAccordian.click();

    await expect(
      $(byTextMatches('(second|minute|hour)s? ago')),
    ).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Go to Map').click();
  });
});
