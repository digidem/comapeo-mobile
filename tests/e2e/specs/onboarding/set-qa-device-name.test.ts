import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {dismissKeyboard} from '../../utils/touchActions';
import {setInputValue} from '../../utils/input';

describe('Onboarding - Set QA Device Name', () => {
  it('should fill in the QA device name and clear the gate', async () => {
    const nameInput = await $(byResourceId('SET_QA_DEVICE_NAME.name-input'));
    await expect(nameInput).toBeDisplayed();

    await setInputValue(nameInput, output.names.qaDevice);
    await dismissKeyboard();

    const saveButton = await $(byResourceId('SET_QA_DEVICE_NAME.save-btn'));
    await saveButton.click();

    const getStartedButton = await $(
      byResourceId('ONBOARDING.get-started-btn'),
    );
    await expect(getStartedButton).toBeDisplayed();
  });
});
