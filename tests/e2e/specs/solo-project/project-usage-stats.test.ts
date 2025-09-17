import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText} from '../../utils/selectors';

describe('Project - Show Project Stats page After Project Rename or Creation', () => {
  it('should take user to Share Project Statistics screen', async () => {
    await expect($(byText('Share Project Statistics'))).toBeDisplayed();
    const skipButton = await $(byText('No, Skip for now'));
    await skipButton.click();
  });
});
