import {describe} from 'mocha';

describe('Passcode', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./obscure-passcode-visibility.test');
  require('./set-passcode.test');
  require('./obscure-mode.test');
  require('./check-passcode-requirements.test');
  require('./post-passcode-setup.test');
});
