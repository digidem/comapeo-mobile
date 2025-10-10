import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Project Settings Solo Project', () => {
  it('should navigate to project settings screen and verify content for solo project', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const viewButton = await $(byText('View'));
    await viewButton.click();

    const screenHeader = await $(byText('Project Settings'));
    await expect(screenHeader).toBeDisplayed();

    await expect($(byTextMatches(output.names.device))).toBeDisplayed();
    await expect($(byTextMatches('mapping on your own'))).toBeDisplayed();
    await expect($(byTextMatches('Invite Collaborators'))).toBeDisplayed();

    await expect($(byTextMatches('Project Categories'))).toBeDisplayed();
    await expect($(byTextMatches('@mapeo/default-config'))).toBeDisplayed();
    await expect($(byTextMatches('Update Set'))).toBeDisplayed();

    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
