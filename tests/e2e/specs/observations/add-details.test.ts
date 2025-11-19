import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {handleGPSAlert} from '../../utils/alerts';
import {output} from '../../utils/naming';

describe('Observations - Add Details Flow', () => {
  it('should create a new observation with Body of water category and open Details screen', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const bodyOfWaterCategory = await $(byTextMatches('Body of water'));
    await bodyOfWaterCategory.click();

    const addDetailsBtn = await $(byResourceId('OBS.add-details-btn'));
    await addDetailsBtn.click();

    await expect($(byResourceId('OBS.add-details-scrn'))).toBeDisplayed();

    await expect($(byTextMatches('Question [0-9] of [0-9]'))).toBeDisplayed();
    const nextBtn = await $(byTextMatches('Next'));
    await expect(nextBtn).toBeDisplayed();
    await expect($(byTextMatches('Name'))).toBeDisplayed();

    const detailsInp = await $(byResourceId('OBS.details-inp'));
    await detailsInp.click();
    await detailsInp.setValue(output.observationDetails.name);

    await nextBtn.click();

    await expect($(byTextMatches('Type of body of water'))).toBeDisplayed();
    await $(byTextMatches(output.observationDetails.type)).click();

    await nextBtn.click();
    await expect($(byTextMatches('Condition'))).toBeDisplayed();
    await $(byTextMatches(output.observationDetails.condition)).click();

    await nextBtn.click();

    await expect($(byTextMatches('Natural Resource Type'))).toBeDisplayed();
    for (const type of output.observationDetails.natResourceType) {
      await $(byTextMatches(type)).click();
    }

    await nextBtn.click();

    await expect($(byTextMatches('Cultural Name'))).toBeDisplayed();
    const culturalNameInp = await $(byResourceId('OBS.details-inp'));
    await culturalNameInp.click();
    await culturalNameInp.setValue(output.observationDetails.culturalName);

    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();
  });

  it('should create observation and determine if details were properly saved', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);
    await handleGPSAlert();

    //navigate to observation list screen
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    //click on body of water observation
    const createdObs = await $(byTextMatches('Body of water'));
    await createdObs.click();

    //scroll down verify details
    await expect(
      $(byTextMatches(output.observationDetails.name)),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches(output.observationDetails.type)),
    ).toBeDisplayed();
    const conditions = await $(
      byTextMatches(output.observationDetails.condition),
    );
    await conditions.scrollIntoView();
    await expect(conditions).toBeDisplayed();

    for (const type of output.observationDetails.natResourceType) {
      const typeElem = await $(byTextMatches(type));
      await typeElem.scrollIntoView();
      await expect(typeElem).toBeDisplayed();
    }

    const culturalNameElem = await $(
      byTextMatches(output.observationDetails.culturalName),
    );
    await culturalNameElem.scrollIntoView();
    await expect(culturalNameElem).toBeDisplayed();
  });
});
