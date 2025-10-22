import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {handleGPSAlert} from '../../utils/alerts';

describe('Project - Rename Project from Drawer while perserving observations', () => {
  it('should create initial observation while in solo project', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
    await expect($(byResourceId('OBS.House-icon'))).toBeDisplayed();
    await expect(houseCategory).toBeDisplayed();
    await driver.pause(1000);
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await handleGPSAlert();
    const mapButton = await $('~Go to map.');
    await mapButton.click();
  });

  it('should open side drawer, navigate to Invite Collaborators screen, and verify content', async () => {
    await $('~Open Menu').click();
    await expect($(byTextMatches(output.names.device))).toBeDisplayed();

    const collaborateButton = await $(byText('Collaborate'));
    await expect(collaborateButton).toBeDisplayed();
    await collaborateButton.click();

    const screenHeader = await $(byText('Collaborate'));
    await expect(screenHeader).toBeDisplayed();

    await expect($(byTextMatches('Join a Project'))).toBeDisplayed();
    await expect($(byTextMatches('Start New Project'))).toBeDisplayed();
    const inviteButton = await $(byTextMatches('Invite Devices'));
    await expect(inviteButton).toBeDisplayed();
    await inviteButton.click();

    await expect(
      $(byTextMatches('Start a new project using my observations')),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches('Invite devices to a new project')),
    ).toBeDisplayed();

    const nextBtn = await $(byText('Next'));
    await expect(nextBtn).toBeDisplayed();
    await nextBtn.click();

    const projectTitle = await $(byTextMatches('Project Name'));
    await expect(projectTitle).toBeDisplayed();
  });

  it('should allow user to rename a project', async () => {
    const createBtn = await $(byResourceId('PROJECT.create-btn'));
    await createBtn.click();

    await expect($(byResourceId('error-icon'))).toBeDisplayed();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.project);
    await createBtn.click();
  });

  it('should take user to project stats screen opt in, and then success screen showing successful sharing', async () => {
    const statsScreen = await $(byTextMatches('Share Project Statistics'));
    await expect(statsScreen).toBeDisplayed();
    const optIn = await $(byTextMatches('Yes, Share Stats'));
    await optIn.click();

    await expect($(byTextMatches(output.names.project))).toBeDisplayed();
    await expect(
      $(byTextMatches('Project statistics are being shared')),
    ).toBeDisplayed();
    await expect($(byText('Invite a Device'))).toBeDisplayed();
    const doneButton = await $(byText('Done'));
    await doneButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });

  it('should leave observations in place with a renamed project', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byText('House'))).toBeDisplayed();
    const mapButton = await $('~Go to map.');
    await mapButton.click();
  });

  it('should verify that a new unnamed project was created in the background', async () => {
    await $('~Open Menu').click();
    await $(byText('Switch Project')).click();
    await expect($(byTextMatches(output.names.project))).toBeDisplayed();
    await expect($(byText(output.names.device))).toBeDisplayed();
    await driver.back();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
