import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Rename Project from Drawer', () => {
  it('should allow user to rename a project', async () => {
    const screenTitle = await $(byText('Name My Project'));
    await expect(screenTitle).toBeDisplayed();

    const createBtn = await $(byResourceId('PROJECT.create-btn'));
    await createBtn.click();

    await expect($(byResourceId('error-icon'))).toBeDisplayed();

    const nameInput = await $(byResourceId('PROJECT.name-inp'));
    await nameInput.setValue(output.names.project);
    await createBtn.click();

    await expect($(byText('Invite a Device'))).toBeDisplayed();
    const categoriesButton = await $(byText('Update Categories Set'));
    await categoriesButton.click();
  });
  it('should take the user to the categories screen', async () => {
    const screenTitle = await $(byText('Categories'));
    await expect(screenTitle).toBeDisplayed();
    await expect($(byText('Import Categories'))).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await backButton.click();
    await $('~Close Menu').click();
  });
  it('should leave observations in place with a renamed project', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byText('Threat'))).toBeDisplayed();
    await expect($(byResourceId('OBS.Threat-list-icon'))).toBeDisplayed();
  });
});
