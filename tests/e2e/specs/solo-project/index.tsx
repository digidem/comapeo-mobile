import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./own-project-headers.test');
  require('./project-settings-no-proj.test');
  require('./rename-project-from-drawer.test');
  require('./project-settings-proj.test');
});
