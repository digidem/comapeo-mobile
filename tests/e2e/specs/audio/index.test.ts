import {describe} from 'mocha';

describe('Audio', function () {
  require('./onboarding/data-privacy.test');
  require('./audio/audio-recording.test');
  require('./audio/audio-playback-delete.test');
  require('./audio/audio-add-additional.test');
});
