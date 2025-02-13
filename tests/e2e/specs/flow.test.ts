import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('./onboarding/data-privacy.test');
  require('./onboarding/privacy-policy.test');
  require('./onboarding/device-naming.test');
  require('./project/edit-device-name.test');
});
