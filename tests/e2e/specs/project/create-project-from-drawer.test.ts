import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Create Project from Drawer', () => {
  it('should allow user to create a new project', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const createJoinOption = await $('~Go to Create or Join Project');
    await createJoinOption.click();

    const createProjectButton = await $(byText('Create a Project'));
    await expect(createProjectButton).toBeDisplayed();
    await createProjectButton.click();

    const createBtn = await $(byResourceId('PROJECT.create-btn'));
    await createBtn.click();

    await expect($(byResourceId('error-icon'))).toBeDisplayed();

    const advancedSettings = await $(
      byResourceId('PROJECT.advanced-settings-toggle'),
    );
    await advancedSettings.click();
    await expect($(byText('Import Config'))).toBeDisplayed();
    await advancedSettings.click();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.project);
    await createBtn.click();

    await expect($(byText('Invite Device'))).toBeDisplayed();
    const goToMapButton = await $(byText('Go to Map'));
    await goToMapButton.click();
  });
});
