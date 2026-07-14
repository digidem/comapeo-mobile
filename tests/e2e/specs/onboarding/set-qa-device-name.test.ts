import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Onboarding - Set QA Device Name', () => {
  it('should fill in the QA device name and clear the gate', async () => {
    const nameInput = await $(byResourceId('SET_QA_DEVICE_NAME.name-input'));
    await expect(nameInput).toBeDisplayed();

    await nameInput.setValue(output.names.qaDevice);

    const saveButton = await $(byResourceId('SET_QA_DEVICE_NAME.save-btn'));
    await saveButton.click();

    const getStartedButton = await $(
      byResourceId('ONBOARDING.get-started-btn'),
    );
    await expect(getStartedButton).toBeDisplayed();
  });
});
