import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';

const UNIQUE_DESCRIPTION = 'Airstrip test obs for second project';

describe('Multiple Projects - Project Data Retention', () => {
  it('should create an observation in the second project', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byText(output.names.secondProject)).click();
    await $('~Close Menu').click();

    await $('~Go to map.').click();
    await $('~Add Observation').click();
    await $(byTextMatches('Airstrip')).click();
    const descriptionInput = await $(byResourceId('OBS.description-inp'));
    await descriptionInput.click();
    await descriptionInput.setValue(UNIQUE_DESCRIPTION);

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);

    try {
      const text = await driver.getAlertText();
      if (text.includes('No GPS signal') || text.includes('Weak GPS signal')) {
        await driver.execute('mobile: acceptAlert', {
          buttonLabel: 'SAVE',
        });
      }
    } catch {
      console.log('No alert found');
    }

    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Go to observations list.').click();
    const airstrip = await $(byText('Airstrip'));
    await expect(airstrip).toBeDisplayed();
    await airstrip.click();

    const description = await $(byText(UNIQUE_DESCRIPTION));
    await expect(description).toBeDisplayed();
    await backButton.click();
  });

  it('should create a third project and not carry over the observation', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byText('Create new project')).click();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.thirdProject);
    await $(byResourceId('PROJECT.create-btn')).click();

    const mapBtn = await $(byText('Go to Map'));
    await mapBtn.click();

    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.thirdProject);

    await $('~Go to observations list.').click();
    checkForElementGone(byText('Airstrip'));
  });

  it('should confirm the observation still exists in the second project', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byTextMatches(output.names.secondProject)).click();
    await $('~Close Menu').click();

    const airstrip = await $(byText('Airstrip'));
    await expect(airstrip).toBeDisplayed();
    await airstrip.click();

    const description = await $(byText(UNIQUE_DESCRIPTION));
    await expect(description).toBeDisplayed();
  });
});
