import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Rename Project from Drawer', () => {
  it('should allow user to rename a project', async () => {
    const createProjectButton = await $(byText('New Project'));
    await expect(createProjectButton).toBeDisplayed();
    await createProjectButton.click();

    const createBtn = await $(byResourceId('PROJECT.create-btn'));
    await createBtn.click();

    await expect($(byResourceId('error-icon'))).toBeDisplayed();

    const advancedSettings = await $(
      byResourceId('PROJECT.advanced-settings-toggle'),
    );
    await advancedSettings.click();
    await expect($(byText('Import Categories'))).toBeDisplayed();
    await advancedSettings.click();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.project);
    await createBtn.click();

    await expect($(byText('Invite Device'))).toBeDisplayed();
    const goToMapButton = await $(byText('Go to Map'));
    await goToMapButton.click();
  });
  it('should leave observations in place with a renamed project', async () => {
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byText('Threat'))).toBeDisplayed();
    await expect($(byResourceId('OBS.Threat-list-icon'))).toBeDisplayed();
  });
});
