import {describe} from 'mocha';

describe('Solo Project', function () {
  require('../onboarding/helper/minimal-onboarding-setup.test');
  require('./own-project-headers.test');
  require('./side-drawer-menu-no-proj.test');
  require('./project-settings-no-proj.test');
  // project can't be renamed currently so temporarily ignoring these tests
  // require('./rename-project-from-drawer.test');
  // require('./project-settings-proj.test');
});
