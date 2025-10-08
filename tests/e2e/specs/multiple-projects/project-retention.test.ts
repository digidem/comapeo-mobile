import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';
import {handleGPSAlert} from '../../utils/alerts';

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
    await handleGPSAlert();

    await $('~Go to observations list.').click();
    const airstrip = await $(byText('Airstrip'));
    await expect(airstrip).toBeDisplayed();
    await airstrip.click();

    const description = await $(byText(UNIQUE_DESCRIPTION));
    await expect(description).toBeDisplayed();
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });

  it('should create a third project and not carry over the observation', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byText('Start new project')).click();
    await $(byText('Start')).click();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.thirdProject);
    await $(byResourceId('PROJECT.create-btn')).click();
    await $(byTextMatches('No, Skip for Now')).click();
    await browser.waitUntil(
      async () => {
        const btn = await $(byText('Done'));
        return !!btn;
      },
      {
        timeout: 10000,
      },
    );
    const doneBtn = await $(byText('Done'));
    await doneBtn.click();

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
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });
});
