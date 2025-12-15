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
    await driver.pause(1000);
    await $(byText('Switch Project')).click();
    await $(byText(output.names.secondProject)).click();
    await $(byResourceId('MAIN.map-screen')).click();

    await $('~Add Observation').click();
    const treeCategory = await $(byTextMatches('Tree'));
    await treeCategory.click();
    const descriptionInput = await $(byResourceId('OBS.description-inp'));
    await descriptionInput.click();
    await descriptionInput.setValue(UNIQUE_DESCRIPTION);

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);
    await handleGPSAlert();

    await $('~Go to observations list.').click();
    const tree = await $(byText('Tree'));
    await expect(tree).toBeDisplayed();
    await tree.click();

    const description = await $(byText(UNIQUE_DESCRIPTION));
    await expect(description).toBeDisplayed();
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });

  it('should create a third project and not carry over the observation', async () => {
    await $('~Open Menu').click();
    await $(byText('Switch Project')).click();
    await $(byText('New Collaboration')).click();
    await $(byText('Start New Project')).click();
    await $(byText('Next')).click();

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
    await driver.back();
    await $('~Go to observations list.').click();
    await $(byResourceId('observationsEmptyView')).click();

    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.thirdProject);
    checkForElementGone(byText('Airstrip'));
  });

  it('should confirm the observation still exists in the second project', async () => {
    await $('~Open Menu').click();
    await $(byText('Switch Project')).click();
    await $(byTextMatches(output.names.secondProject)).click();
    await driver.back();
    await $('~Go to observations list.').click();

    const tree = await $(byText('Tree'));
    await expect(tree).toBeDisplayed();
    await tree.click();

    const description = await $(byText(UNIQUE_DESCRIPTION));
    await expect(description).toBeDisplayed();
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });
});
