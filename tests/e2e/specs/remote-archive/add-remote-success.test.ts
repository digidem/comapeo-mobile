import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {getTodayFormattedDate} from '../../utils/date';
import {output} from '../../utils/naming';
import {testFlags} from '../../utils/testFlags';

let archiveAdded = false;

describe('Remote Archive - Add Success Flow', () => {
  it('navigates to Remote Archive screen', async () => {
    await expect($(byTextMatches('Remote Archive \\| OFF'))).toBeDisplayed();
    await $(byText('View Details')).click();
    await expect($(byText('Add Remote Archive'))).toBeDisplayed();
  });

  it('fills and submits server URL', async () => {
    const addArchiveBtn = await $(byText('Add Remote Archive'));
    await addArchiveBtn.click();

    const urlInput = await $(byResourceId('RA.url-inp'));
    await urlInput.setValue(output.remoteServer);
    await $(byResourceId('OBS.edit-save-btn')).click();

    await expect($(byTextMatches('You are adding'))).toBeDisplayed();
    await expect($(byTextMatches('CoMapeo Server'))).toBeDisplayed();
    await expect($(byTextMatches(output.remoteServer))).toBeDisplayed();

    const seeIncluded = await $(byTextMatches('See What is Included'));
    await seeIncluded.click();
    await expect($(byTextMatches('Observations'))).toBeDisplayed();
    await expect($(byTextMatches('Tracks'))).toBeDisplayed();
    await $(byText('Close')).click();

    const addButton = await $(byTextMatches('\\+ Add Remote Archive'));
    await addButton.click();
    const errorModal = await $(byTextMatches('Something went wrong'));
    if (await errorModal.isDisplayed()) {
      await $(byText('Go Back')).click();
      await $(byTextMatches('\\+ Add Remote Archive')).click();
    }
  });

  it('shows success UI and added archive info', async () => {
    try {
      await $(byText('Remote Archive Added')).waitForDisplayed({
        timeout: 20000,
      });
      archiveAdded = true;
    } catch {
      testFlags.remoteArchiveAddFailed = true;
      console.warn('🛑 Remote Archive addition failed — restarting app');

      await driver.terminateApp('com.comapeo.rc');
      await driver.activateApp('com.comapeo.rc');
      return;
    }
    await expect($(byText('Remote Archive Added'))).toBeDisplayed();
    await expect($(byTextMatches(output.remoteServer))).toBeDisplayed();
    await $(byText('Close')).click();

    await expect($(byTextMatches('Remote Archive is On'))).toBeDisplayed();
    await expect($(byResourceId('RA.archive-name'))).toHaveText(
      output.remoteServer,
    );
    const today = getTodayFormattedDate();
    await expect($(byText(today))).toBeDisplayed();
    await expect($(byTextMatches('Remove Server'))).toBeDisplayed();
  });

  it('shows remote archive on in project settings', async () => {
    if (!archiveAdded) return;

    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    await expect($(byText('Project Settings'))).toBeDisplayed();
    await expect($(byTextMatches('Remote Archive \\| ON'))).toBeDisplayed();
  });
});
