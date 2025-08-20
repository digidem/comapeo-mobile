import {describe} from 'mocha';

describe('Audio', () => {
  require('../onboarding/minal-setup.test');
  require('./audio-recording.test');
  require('./audio-playback-delete.test');
  require('./audio-add-additional.test');
});
