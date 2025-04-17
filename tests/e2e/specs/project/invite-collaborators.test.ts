import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Project - Solo Project Invite/ Name Project Flow', () => {
  it('should open side drawer, navigate to Invite Collaborators screen, and verify content', async () => {
    const projectName = await $(byResourceId('MENU.project-name'));
    await expect(projectName).toHaveText('My Solo Project');

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    await inviteButton.click();

    const screenHeader = await $(byText('Invite Collaborators'));
    await expect(screenHeader).toBeDisplayed();

    await expect(
      $(byTextMatches('Share observations with others')),
    ).toBeDisplayed();

    await expect(
      $(byTextMatches('Once you name your project')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Only devices you invite'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Manage and control sharing')),
    ).toBeDisplayed();

    const nameProjectBtn = await $(byText('Name My Project'));
    await expect(nameProjectBtn).toBeDisplayed();
    await nameProjectBtn.click();

    const projectTitle = await $(byTextMatches('Enter a name for the Project'));
    await expect(projectTitle).toBeDisplayed();
  });
});
