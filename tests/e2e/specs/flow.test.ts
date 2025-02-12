import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('./onboarding/device-naming.test');
  require('./project/edit-device-name.test');
});
