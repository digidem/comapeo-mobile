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

  it('should show projects in the correct order', async () => {
    const elements = await $$('//*[@testID="MENU.project-name"]');
    if (!Array.isArray(elements)) throw new Error('Expected array of elements');
    const projectTitles = elements as WebdriverIO.Element[];
    const titles = await Promise.all(projectTitles.map(el => el.getText()));

    expect(titles[0]).toBe(output.names.project);
    expect(titles[1]).toBe(output.names.secondProject);
    expect(titles[2]).toBe(output.names.thirdProject);
  });
});
