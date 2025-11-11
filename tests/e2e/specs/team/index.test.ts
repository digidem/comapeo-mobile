import {describe} from 'mocha';

describe('Team', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('../solo-project/helper/minimal-project-creation.test');
  require('./team-screen-coordinator.test');
  require('./collaborator-info-coordinator.test');
});
