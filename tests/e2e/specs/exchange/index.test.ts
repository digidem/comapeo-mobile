import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/minal-setup.test');
  require('./solo.test');
  require('../project/helper/minimal-project-creation.test');
  require('./no-devices.test');
  require('./everything.test');
  require('./previews.test');
});
