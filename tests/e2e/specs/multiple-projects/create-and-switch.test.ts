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
  });

  it('should take user to project stats screen', async () => {
    const statsScreen = await $(byTextMatches('Share Project Statistics'));
    await expect(statsScreen).toBeDisplayed();
    const skip = await $(byTextMatches('No, Skip for Now'));
    await skip.click();
  });

  it('should take user to success screen', async () => {
    await expect($(byTextMatches(output.names.secondProject))).toBeDisplayed();
    await expect($(byText('Invite a Device'))).toBeDisplayed();
  });

  it('should land in the new project and display it on the Map screen', async () => {
    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();

    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.secondProject);
  });

  it('should display the project name in the side drawer', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    await expect($(byText(`${output.names.secondProject}`))).toBeDisplayed();
    await expect(
      $(byText('You are a coordinator on this project.')),
    ).toBeDisplayed();

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    const viewButton = await $(byText('View'));
    await expect(viewButton).toBeDisplayed();

    await inviteButton.click();
    await expect($(byTextMatches('Select Device to Invite'))).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
  });

  it('should switch back to the Solo project and update headers accordingly', async () => {
    await $(byText('All Projects')).click();
    await $(byTextMatches(output.names.device)).click();
    await $('~Close Menu').click();

    const soloHeader = await $(byResourceId('HOME.header-title'));
    await expect(soloHeader).toHaveText(output.names.device);
  });
});
