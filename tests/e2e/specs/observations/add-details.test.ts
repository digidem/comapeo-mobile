import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Add Details Flow', () => {
  it('should create a new observation with Gathering Site category and open Details screen', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const gatherSite = await $(byTextMatches('Gathering Site'));
    await gatherSite.click();

    const addDetailsBtn = await $(byResourceId('OBS.add-details-btn'));
    await addDetailsBtn.click();

    await expect($(byResourceId('OBS.add-details-scrn'))).toBeDisplayed();

    const backArrow = await $(byResourceId('MAIN.header-back-btn'));
    await expect(backArrow).toBeDisplayed();

    await expect($(byTextMatches('Question [0-9] of [0-9]'))).toBeDisplayed();
    await expect($(byTextMatches('(Next|Done)'))).toBeDisplayed();
    await expect($(byTextMatches('What is gathered here?'))).toBeDisplayed();

    const detailsInp = await $(byResourceId('OBS.details-inp'));
    const isFocused = await detailsInp.getAttribute('focused');
    expect(isFocused).toBe('true');
  });

  it('should return to create new Observation screen via back arrow, then re-open Details', async () => {
    const backArrow = await $(byResourceId('MAIN.header-back-btn'));
    await backArrow.click();
    await expect($(byTextMatches('New Observation'))).toBeDisplayed();

    const addDetailsBtn = await $(byResourceId('OBS.add-details-btn'));
    await addDetailsBtn.click();

    const detailsInp = await $(byResourceId('OBS.details-inp'));
    await detailsInp.click();
    await detailsInp.setValue('Some details');
    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();
  });

  it('should confirm we are back on the New Observation screen, then save & go back', async () => {
    await expect($(byTextMatches('New Observation'))).toBeDisplayed();

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();

    const mainBack = await $(byResourceId('MAIN.header-back-btn'));
    await mainBack.click();
  });
});
