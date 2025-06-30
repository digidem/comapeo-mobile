import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Multiple Projects - Create and Switch Between Projects', () => {
  it('should create a second project from the All Projects screen', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();

    await $(byText('Start new project')).click();
    await $(byText('Start')).click();
    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.secondProject);
    await $(byResourceId('PROJECT.create-btn')).click();

    await expect($(byTextMatches(output.names.secondProject))).toBeDisplayed();
  });

  it('should land in the new project and display it on the Map screen', async () => {
    const mapBtn = await $(byTextMatches('Start Mapping'));
    await mapBtn.click();

    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.secondProject);
  });

  it('should switch back to the Solo project and update headers accordingly', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byTextMatches('My Solo Project')).click();
    await $('~Close Menu').click();

    const soloHeader = await $(byResourceId('HOME.header-title'));
    await expect(soloHeader).toHaveText('My Solo Project');
  });
});
