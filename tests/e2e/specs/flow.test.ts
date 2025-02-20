import {describe} from 'mocha';

describe('CoMapeo E2E Flow', function () {
  require('./onboarding/data-privacy.test');
  require('./onboarding/privacy-policy.test');
  require('./onboarding/device-naming.test');
  require('./project/edit-device-name.test');
  require('./main/side-drawer-menu-no-proj.test');
  require('./project/create-project-from-drawer.test');
  require('./project/unjoin-project.test');
  require('./main/side-drawer-menu-proj.test');
});
