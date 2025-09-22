import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../../utils/selectors';
import {output} from '../../../utils/naming';

describe('Create Project and land on map screen', () => {
  it('should create a project from menu', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();

    await $(byText('Start new project')).click();
    await $(byText('Start')).click();
    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.secondProject);
    await $(byResourceId('PROJECT.create-btn')).click();
    await $(byTextMatches('No, Skip for Now')).click();
    await expect($(byTextMatches(output.names.secondProject))).toBeDisplayed();
  });

  it('should land in the new project and display it on the Map screen', async () => {
    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();

    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.secondProject);
  });
});
