import {describe} from 'mocha';

describe('Photos', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./photo-while-creating-observations.test');
  require('./validated-photos.test');
});
