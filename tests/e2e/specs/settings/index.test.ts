import {describe} from 'mocha';

describe('Settings', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./edit-device-name.test');
  require('./coordinates.test');
  require('./language.test');
  require('./about-comapeo.test');
  // TODO: re-enable once Early Access feature flag is back on
  // require('./early-access.test');
});
