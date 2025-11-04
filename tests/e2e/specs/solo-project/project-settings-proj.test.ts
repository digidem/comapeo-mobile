import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Project - Project Settings Named Project', () => {
  it('should navigate to project settings screen and verify content for named project', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const viewSettings = await $('~Go to project settings screen.');
    await viewSettings.click();

    const screenHeader = await $(byText('Project Settings'));
    await expect(screenHeader).toBeDisplayed();

    await expect(
      $(byText(`${output.names.project} - Coordinator`)),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches('This device is a coordinator on this project.')),
    ).toBeDisplayed();
    await expect($(byText('Edit Info'))).toBeDisplayed();

    await expect($(byText('Project Collaborators'))).toBeDisplayed();
    await expect(
      $(byTextMatches('This device is a coordinator on this project.')),
    ).toBeDisplayed();
    await expect($(byText('View Team'))).toBeDisplayed();

    const projectCategories = await $(byText('Project Categories'));
    await projectCategories.scrollIntoView();
    await expect(projectCategories).toBeDisplayed();
    await expect($(byTextMatches('@mapeo/'))).toBeDisplayed();
    await expect($(byText('Update Set'))).toBeDisplayed();

    await $(byTextMatches('Project Statistics')).scrollIntoView();
    await expect($(byTextMatches('ON'))).toBeDisplayed();
    await expect(
      $(byTextMatches('This project is sharing anonymous statistics')),
    ).toBeDisplayed();
    await expect($(byText('Update'))).toBeDisplayed();
  });

  it('should navigate to sharing project statistics screen from project settings and verify content', async () => {
    const updateButton = await $(byText('Update'));
    await updateButton.click();
    const statsContainer = await $(
      byTextMatches(
        'Anonymized information about your project including number of observations',
      ),
    );
    await expect(statsContainer).toBeDisplayed();
  });

  it('should toggle off sharing project statistics and see bottom sheet warning', async () => {
    const toggleOn = await $(byResourceId('PROJECT_SETTINGS.stats-on'));
    await expect(toggleOn).toBeDisplayed();
    await toggleOn.click();
    const offSheet = await $(byResourceId('PROJECT_STATS.off-sheet'));
    await expect(offSheet).toBeDisplayed();
    const closeBtn = await $(byText('Close'));
    await closeBtn.click();
    await checkForElementGone(byResourceId('PROJECT_STATS.off-sheet'));
    const toggleOff = await $(byResourceId('PROJECT_SETTINGS.stats-off'));
    await expect(toggleOff).toBeDisplayed();
  });

  it('should show that Project Statistics is off in project settings', async () => {
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    const statsOffText = await $(byTextMatches('OFF'));
    await expect(statsOffText).toBeDisplayed();
    await expect(
      $(byTextMatches('Project statistics are not being shared')),
    ).toBeDisplayed();
  });
  it('should navigate back to map', async () => {
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
