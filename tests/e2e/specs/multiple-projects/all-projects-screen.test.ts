import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Multiple Projects - All Projects Screen', () => {
  it('should show projects in order of creation when solo project is the selected project', async () => {
    await $('~Open Menu').click();
    await $(byTextMatches('All Projects')).click();
    await $(byResourceId('project_card_test_phone')).click();
    // have to test the test ids because the test id is not on the header text element
    await $(byText('All Projects')).click();

    const firstCard = await $(byResourceId('project_card_test_phone'));
    const secondCard = await $(byResourceId('project_card_second_project'));
    const thirdCard = await $(byResourceId('project_card_third_project'));

    await expect(firstCard).toBeDisplayed();
    await expect(secondCard).toBeDisplayed();
    await expect(thirdCard).toBeDisplayed();

    const firstLocation = await firstCard.getLocation();
    const secondLocation = await secondCard.getLocation();
    const thirdLocation = await thirdCard.getLocation();

    expect(firstLocation.y).toBeLessThan(secondLocation.y);
    expect(secondLocation.y).toBeLessThan(thirdLocation.y);
    await $(byText('Close')).click();
    await $(byResourceId('observationsEmptyView')).click();
  });

  it('should show the selected project on top', async () => {
    await $('~Open Menu').click();
    await $(byText('All Projects')).click();
    await $(byResourceId('project_card_second_project')).click();
    // have to test the test ids because the test id is not on the header text element
    await $(byText('All Projects')).click();

    const firstCard = await $(byResourceId('project_card_second_project'));
    const secondCard = await $(byResourceId('project_card_test_phone'));
    const thirdCard = await $(byResourceId('project_card_third_project'));

    await expect(firstCard).toBeDisplayed();
    await expect(secondCard).toBeDisplayed();
    await expect(thirdCard).toBeDisplayed();

    const firstLocation = await firstCard.getLocation();
    const secondLocation = await secondCard.getLocation();
    const thirdLocation = await thirdCard.getLocation();

    expect(firstLocation.y).toBeLessThan(secondLocation.y);
    expect(secondLocation.y).toBeLessThan(thirdLocation.y);
  });
});
