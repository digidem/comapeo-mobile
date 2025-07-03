import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';

describe('Project - Solo Project Invite/ Name Project Flow', () => {
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
});
