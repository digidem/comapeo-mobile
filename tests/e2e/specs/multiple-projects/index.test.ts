import {describe} from 'mocha';

describe('multi-project', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./create-and-switch.test');
  require('./project-retention.test');
  require('./all-projects-screen.test');
  require('./edit-project-details.test');
});
