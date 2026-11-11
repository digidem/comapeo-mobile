import {describe} from 'mocha';

describe('onboarding', function () {
  require('./set-qa-device-name.test');
  require('./data-privacy.test');
  require('./privacy-policy.test');
  require('./device-naming.test');
  require('./success.test');
});
