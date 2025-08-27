import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./start-track.test');
  require('./no-movement-track.test');
  // require('./view-edit-track.test');
});
