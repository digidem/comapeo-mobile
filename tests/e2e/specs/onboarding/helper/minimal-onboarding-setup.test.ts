import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('../set-qa-device-name.test');
  require('../data-privacy.test');
  require('../device-naming.test');
  require('../always-stay-notified.test');
  require('../success.test');
});
