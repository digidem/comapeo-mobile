import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('../solo-project/helper/minimal-project-creation.test');
  require('./create-observation.test');
  require('./add-details.test');
});
