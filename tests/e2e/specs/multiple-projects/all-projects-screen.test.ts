import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Multiple Projects - All Projects Screen', () => {
  it('should show projects in order of creation when solo project is the selected project', async () => {
    await $('~Open Menu').click();
    await $(byTextMatches('All Projects')).click();
    await $(byResourceId('project_card_test phone')).click();
    // have to test the test ids because the test id is not on the header text element
    await $(byText('All Projects')).click();
    const rawCards = await $$(
      'android=new UiSelector().resourceIdMatches(".*project_card_.*")',
    );
    const cards = rawCards as unknown as WebdriverIO.Element[];

    const testIds: string[] = [];
    for (const card of cards) {
      const id = await card.getAttribute('resource-id');
      testIds.push(id);
    }
    expect(testIds[0]).toMatch(/project_card_test phone$/);
    expect(testIds[1]).toMatch(/project_card_second project$/);
    expect(testIds[2]).toMatch(/project_card_third project$/);
  });

  it('should show the selected project on top', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byTextMatches(output.names.secondProject)).click();
    // have to test the test ids because the test id is not on the header text element
    await $(byText('All Projects')).click();
    const rawCards = await $$(
      'android=new UiSelector().resourceIdMatches("*project_card_*")',
    );
    const cards = rawCards as unknown as WebdriverIO.Element[];

    const testIds: string[] = [];
    for (const card of cards) {
      const id = await card.getAttribute('resource-id');
      testIds.push(id);
    }
    expect(testIds[0]).toMatch(/project_card_second_project$/);
    expect(testIds[1]).toMatch(/project_card_test_phone$/);
    expect(testIds[2]).toMatch(/project_card_third_project$/);
  });
});
