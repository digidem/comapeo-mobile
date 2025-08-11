import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('./data-privacy.test');
  require('./privacy-policy.test');
  require('./device-naming.test');
});
