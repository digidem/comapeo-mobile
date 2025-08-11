import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../onboarding/setup.test');
  require('./create-observation.test');
});
