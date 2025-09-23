import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Multiple Projects - All Projects Screen', () => {
  it('should show all projects and correct role labels', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();

    const originalCard = await $(byTextMatches('My Solo Project'));
    await expect(originalCard).toBeDisplayed();

    const newProject = await $(byText(output.names.secondProject));
    await expect(newProject).toBeDisplayed();

    const otherProject = await $(byText(output.names.thirdProject));
    await expect(otherProject).toBeDisplayed();

    const coordinatorEls = await $$(
      byTextMatches('You are a coordinator on this project'),
    );
    expect(coordinatorEls.length).toBe(2);

    await expect($(byText('Start new project'))).toBeDisplayed();
  });

  it('should show projects in the correct order based on testID', async () => {
    // have to test the test ids because the test id is not on the header text element
    const rawCards = await $$(
      'android=new UiSelector().resourceIdMatches(".*project_card_.*")',
    );
    const cards = rawCards as unknown as WebdriverIO.Element[];

    const testIds: string[] = [];
    for (const card of cards) {
      const id = await card.getAttribute('resource-id');
      testIds.push(id);
    }
    expect(testIds[0]).toMatch(/project_card_my_solo_project$/);
    expect(testIds[1]).toMatch(/project_card_second_project$/);
    expect(testIds[2]).toMatch(/project_card_third_project$/);
  });
});
