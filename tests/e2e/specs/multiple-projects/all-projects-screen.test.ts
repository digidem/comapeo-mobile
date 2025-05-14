import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Multiple Projects - All Projects Screen', () => {
  it('should show all projects and correct role labels', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();

    const originalCard = await $(byTextMatches(output.names.project));
    await expect(originalCard).toBeDisplayed();

    const newProject = await $(byText(output.names.secondProject));
    await expect(newProject).toBeDisplayed();

    const otherProject = await $(byText(output.names.thirdProject));
    await expect(otherProject).toBeDisplayed();

    const coordinatorEls = await $$(
      byTextMatches('You are a coordinator on this project'),
    );
    expect(coordinatorEls.length).toBe(3);

    checkForElementGone(byTextMatches('mapping on your own'));
    checkForElementGone(byTextMatches('participant on this project'));

    await expect($(byText('Create new project'))).toBeDisplayed();
  });

  it('should show projects in the correct order based on testID', async () => {
    // have to test the test ids because the test id is not on the header text element
    const rawCards = await $$(
      '//*[@testID and starts-with(@testID, "project-card-")]',
    );
    const cards = rawCards as unknown as WebdriverIO.Element[];

    const testIds: string[] = [];
    for (const card of cards) {
      const id = await card.getAttribute('testID');
      testIds.push(id);
    }

    expect(testIds[0]).toBe(
      `project-card-${output.names.project.toLowerCase().replace(/\s+/g, '-')}`,
    );
    expect(testIds[1]).toBe(
      `project-card-${output.names.secondProject.toLowerCase().replace(/\s+/g, '-')}`,
    );
    expect(testIds[2]).toBe(
      `project-card-${output.names.thirdProject.toLowerCase().replace(/\s+/g, '-')}`,
    );
  });
});
