import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Multiple Projects - Create and Switch Between Projects', () => {
  it('should create a second project from the All Projects screen', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();

    await $(byText('New Collaboration')).click();
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

  it('should display the project name in the side drawer', async () => {
    const doneBtn = await $(byTextMatches('Done'));
    await doneBtn.click();
    await expect($(byText(`${output.names.secondProject}`))).toBeDisplayed();
    await expect($(byText('Coordinator'))).toBeDisplayed();

    const switchButton = await $(byText('Switch Projects'));
    await expect(switchButton).toBeDisplayed();

    await expect($(byTextMatches('Exchange'))).toBeDisplayed();
  });

  it('Should close menu and show project name as header', async () => {
    await driver.back();
    const header = await $(byResourceId('HOME.header-title'));
    await expect(header).toHaveText(output.names.secondProject);
  });

  // This is going to change soon
  // it('should switch back to the Solo project and update headers accordingly', async () => {
  //   await $('~Open Menu').click();
  //   await $(byText('All Projects')).click();
  //   await $(byTextMatches('Erik')).click();
  //   // await $(byTextMatches(output.names.device)).click();
  //   // await $(byResourceId('MAIN.map-screen')).click();
  //   await driver.back();
  //   const soloHeader = await $(byResourceId('HOME.header-title'));
  //   await expect(soloHeader).toHaveText(output.names.device);
  // });
});
