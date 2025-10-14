import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Solo Project Headers', () => {
  it('should display Device Name on the Map screen header', async () => {
    const mapTab = await $('~Go to map.');
    await mapTab.click();

    const headerTitle = await $(byResourceId('HOME.header-title'));
    await expect(headerTitle).toBeDisplayed();
    await expect(headerTitle).toHaveText(output.names.device);
  });

  it('should display Device Name on ObservationsList header and show the solo icon', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect($(byTextMatches(output.names.device))).toBeDisplayed();

    const drawerButton = await $(byResourceId('drawer-icon-home'));
    await expect(drawerButton).toBeDisplayed();

    const soloCardText = await $(byResourceId('HOME.no-project-icon'));
    await expect(soloCardText).toBeDisplayed();
  });
});
