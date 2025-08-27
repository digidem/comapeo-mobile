import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('../solo-project/helper/minimal-project-creation.test');
  require('./add-remote-error.test');
  require('./add-remote-success-and-removal.test');
});
