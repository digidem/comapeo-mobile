import {describe, before} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  // set timeout to not wait for screen to go idle which sometimes does not happen while track records
  before(async () => {
    await driver.updateSettings({waitForIdleTimeout: 0});
  });

  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./start-track.test');
  require('./no-movement-track.test');
  // require('./view-edit-track.test');
});
