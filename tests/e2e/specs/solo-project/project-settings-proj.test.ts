import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Project Settings Named Project', () => {
  it('should navigate to project settings screen and verify content for named project', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const viewButton = await $(byText('View'));
    await viewButton.click();

    const screenHeader = await $(byText('Project Settings'));
    await expect(screenHeader).toBeDisplayed();

    await expect($(byText(output.names.project))).toBeDisplayed();
    await expect(
      $(byTextMatches('This device is a coordinator on this project.')),
    ).toBeDisplayed();
    await expect($(byText('Edit Info'))).toBeDisplayed();

    await expect($(byText('Project Collaborators'))).toBeDisplayed();
    await expect(
      $(byTextMatches('This device is a coordinator on this project.')),
    ).toBeDisplayed();
    await expect($(byText('View Team'))).toBeDisplayed();

    await expect($(byText('Project Categories'))).toBeDisplayed();
    await expect($(byTextMatches('@mapeo/'))).toBeDisplayed();
    await expect($(byText('Update Set'))).toBeDisplayed();

    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Close Menu').click();
  });
});
