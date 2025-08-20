import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  //   require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./obscure-passcode-visibility.test');
  require('./set-passcode.test');
  require('./obscure-mode.test');
  require('./check-passcode-requirements.test');
  require('./post-passcode-setup.test');
});
