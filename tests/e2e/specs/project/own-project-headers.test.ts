import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Project - Solo Project Headers', () => {
  it('should display "My Solo Project" on the Map screen header', async () => {
    const mapTab = await $('~Go to map.');
    await mapTab.click();

    const headerTitle = await $(byResourceId('HOME.header-title'));
    await expect(headerTitle).toBeDisplayed();
    await expect(headerTitle).toHaveText('My Solo Project');
  });

  it('should display "My Solo Project" on ObservationsList header and show the solo icon', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect($(byTextMatches('My Solo Project'))).toBeDisplayed();

    const drawerButton = await $(byResourceId('drawer-icon-home'));
    await expect(drawerButton).toBeDisplayed();

    const soloCardText = await $(byResourceId('HOME.no-project-icon'));
    await expect(soloCardText).toBeDisplayed();
  });
});
