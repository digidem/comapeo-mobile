import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';

const UPDATED_PROJECT_NAME = 'Updated Project Name for Last Project';
const UPDATED_PROJECT_DESCRIPTION =
  'Updated description here for the last project.';

describe('Multiple Projects - Edit Project Details', () => {
  it('should allow editing a named project’s name and description', async () => {
    const thirdProject = await $(byText(output.names.thirdProject));
    await thirdProject.click();

    await $(byText('View')).click();

    const editInfoBtn = await $('~Edit Info');
    await editInfoBtn.click();

    const nameInput = await $(byResourceId('edit-project-name'));
    await nameInput.clearValue();
    await nameInput.setValue(UPDATED_PROJECT_NAME);

    const descriptionInput = await $(byResourceId('edit-project-description'));
    await descriptionInput.setValue(UPDATED_PROJECT_DESCRIPTION);

    const saveButton = await $(byResourceId('OBS.edit-save-btn'));
    await saveButton.click();
  });

  it('should verify presence of new name and description', async () => {
    await expect($(byTextMatches(UPDATED_PROJECT_NAME))).toBeDisplayed();
    await expect($(byTextMatches(UPDATED_PROJECT_DESCRIPTION))).toBeDisplayed();
    await checkForElementGone(byText(output.names.thirdProject));
    await $('~Close Menu').click();
    await expect($(byTextMatches(UPDATED_PROJECT_NAME))).toBeDisplayed();
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byTextMatches(UPDATED_PROJECT_NAME))).toBeDisplayed();
  });
});
