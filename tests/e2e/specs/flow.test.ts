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
  require('./main/gps.test');
  require('./main/map.test');
  require('./observations/create-observation.test');
  require('./observations/add-details.test');
  require('./observations/view-observations.test');
  require('./settings/coordinates.test');
  require('./settings/language.test');
  require('./settings/about-comapeo.test');
  require('./passcode/set-passcode.test');
  require('./passcode/check-passcode-requirements.test');
});
