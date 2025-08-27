import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./create-observation.test');
  require('./add-details.test');
  require('./view-observations.test');
  require('./observation-metadata.test');
  require('./edit-observation.test');
  require('./delete-observation.test');
  require('./restart-navigation.test');
});
