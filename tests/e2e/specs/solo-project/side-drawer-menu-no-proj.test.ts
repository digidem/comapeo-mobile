import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byText, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Main - Side Drawer Menu - No Project', () => {
  it('should open the side drawer and verify menu options', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    await expect($(byTextMatches(output.names.device))).toBeDisplayed();
    await expect($(byText('Just You'))).toBeDisplayed();

    await expect(
      $(byTextMatches("You're mapping on your own")),
    ).toBeDisplayed();

    await expect($('~Go to app settings screen.')).toBeDisplayed();
    await expect($('~Go to background maps screen.')).toBeDisplayed();
    await expect($('~Go to map screen.')).toBeDisplayed();

    await $(byResourceId('observationsEmptyView')).click();
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });
});
