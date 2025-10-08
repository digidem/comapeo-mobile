import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {tapAboveElement} from '../../utils/touchActions';
import {checkForElementGone} from '../../utils/checkForGone';
import {handleGPSAlert} from '../../utils/alerts';

describe('Observations - Edit Observation Flow', () => {
  it('should open editable observation and navigate to edit screen', async () => {
    const lakeItem = await $(byTextMatches('Lake'));
    await lakeItem.click();
    await expect($(byTextMatches('Lake'))).toBeDisplayed();

    const editBtn = await $(byResourceId('editButton'));
    await editBtn.click();

    await expect($(byTextMatches('Edit Observation'))).toBeDisplayed();
    await expect($(byTextMatches('Change'))).toBeDisplayed();
    await expect($(byResourceId('OBS.description-inp'))).toBeDisplayed();
  });

  it('should update description and collapse keyboard', async () => {
    const descriptionInput = await $(byResourceId('OBS.description-inp'));
    await descriptionInput.click();
    await descriptionInput.setValue('Updated description');
    const addBottomBar = await $(byResourceId('OBS.add-photo-btn-keyboard'));
    await tapAboveElement(addBottomBar, 100);
    checkForElementGone(byResourceId('OBS.add-photo-btn-keyboard'));
  });

  it('should navigate to details screen and complete a question', async () => {
    const addDetailsBtn = await $(byResourceId('OBS.add-details-btn'));
    await addDetailsBtn.click();
    await expect($(byTextMatches('Question [0-9] of [0-9]'))).toBeDisplayed();

    const detailInput = await $(byResourceId('OBS.details-inp'));
    await detailInput.setValue('New detail');
    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();
  });

  it('should save updated observation and return to view screen', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);
    await handleGPSAlert();

    await expect($(byTextMatches('Lake'))).toBeDisplayed();
    await expect($(byTextMatches('Updated description'))).toBeDisplayed();
    await expect($(byTextMatches('New detail'))).toBeDisplayed();
    await $(byResourceId('MAIN.header-back-btn')).click();
  });
});
