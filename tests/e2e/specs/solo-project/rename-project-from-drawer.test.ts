import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Rename Project from Drawer while perserving observations', () => {
  it('should create initial observation while in solo project', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
    await expect($(byResourceId('OBS.House-icon'))).toBeDisplayed();
    await expect(houseCategory).toBeDisplayed();
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
    } catch (err) {
      console.log('No RN Alert dialog was found.');
    }
    const mapButton = await $('~Go to map.');
    await mapButton.click();
  });

  it('should open side drawer, navigate to Invite Collaborators screen, and verify content', async () => {
    await $('~Open Menu').click();
    await expect($(byTextMatches('My Solo Project'))).toBeDisplayed();

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    await inviteButton.click();

    const screenHeader = await $(byText('Invite Collaborators'));
    await expect(screenHeader).toBeDisplayed();

    await expect(
      $(byTextMatches('Share observations with others')),
    ).toBeDisplayed();

    await expect(
      $(byTextMatches('Name your project to start collaborating')),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches('Only devices invited to this project')),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches('Easily manage project contributors')),
    ).toBeDisplayed();

    const nameProjectBtn = await $(byText('Name My Project'));
    await expect(nameProjectBtn).toBeDisplayed();
    await nameProjectBtn.click();

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
  });

  it('should leave observations in place with a renamed project', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byText('House'))).toBeDisplayed();
    const mapButton = await $('~Go to map.');
    await mapButton.click();
  });
});
