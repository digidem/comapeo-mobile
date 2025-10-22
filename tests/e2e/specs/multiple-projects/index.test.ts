import {describe} from 'mocha';

describe('multi-project', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./create-and-switch.test');
  require('./project-retention.test');
  require('./all-projects-screen.test');
  // Access to this edit project is slightly changing, so lets update this test accordingly
  //require('./edit-project-details.test');
});
